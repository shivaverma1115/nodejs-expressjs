import jwt, { SignOptions } from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import { Op } from 'sequelize';
import { env, isProduction } from '../../config/env';
import { User } from '../../database/models/User';
import { RefreshToken } from '../../database/models/RefreshToken';
import { PasswordResetToken } from '../../database/models/PasswordResetToken';
import { AppError } from '../../common/errors/AppError';
import { HttpStatus } from '../../common/constants/httpStatus';
import { UserRole } from '../../common/constants/roles';
import { comparePassword, generateRawToken, hashPassword, hashToken } from '../../common/utils/crypto';
import { enqueueEmail } from '../../jobs/queues';
import { AuthTokens, AuthUser } from './auth.types';

const googleClient = env.GOOGLE_CLIENT_ID ? new OAuth2Client(env.GOOGLE_CLIENT_ID) : null;

function toAuthUser(user: User): AuthUser {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    isEmailVerified: user.isEmailVerified,
  };
}

function signAccessToken(user: User) {
  const options: SignOptions = { expiresIn: env.JWT_ACCESS_EXPIRES_IN as SignOptions['expiresIn'] };
  return jwt.sign({ sub: user.id, email: user.email, role: user.role, type: 'access' }, env.JWT_ACCESS_SECRET, options);
}

function parseDurationMs(value: string) {
  const match = /^(\d+)([smhd])$/.exec(value);
  if (!match) return 7 * 24 * 60 * 60 * 1000;
  const amount = Number(match[1]);
  const unit = match[2];
  const map = { s: 1000, m: 60_000, h: 3_600_000, d: 86_400_000 };
  return amount * map[unit as keyof typeof map];
}

async function issueTokens(user: User): Promise<AuthTokens> {
  const accessToken = signAccessToken(user);
  const refreshToken = generateRawToken();
  await RefreshToken.create({
    userId: user.id,
    tokenHash: hashToken(refreshToken),
    expiresAt: new Date(Date.now() + parseDurationMs(env.JWT_REFRESH_EXPIRES_IN)),
    revokedAt: null,
  });
  return { accessToken, refreshToken };
}

export async function register(input: { name: string; email: string; password: string }) {
  const existing = await User.findOne({ where: { email: input.email } });
  if (existing) {
    throw new AppError('Email is already registered', HttpStatus.CONFLICT);
  }
  const user = await User.create({
    name: input.name,
    email: input.email,
    password: await hashPassword(input.password),
    role: UserRole.USER,
    isEmailVerified: false,
  });
  await enqueueEmail({
    to: user.email,
    subject: 'Welcome',
    text: `Welcome ${user.name}. Your account was created successfully.`,
  });
  const tokens = await issueTokens(user);
  return { user: toAuthUser(user), tokens };
}

export async function login(input: { email: string; password: string }) {
  const user = await User.findOne({ where: { email: input.email } });
  if (!user?.password) {
    throw new AppError('Invalid email or password', HttpStatus.UNAUTHORIZED);
  }
  const ok = await comparePassword(input.password, user.password);
  if (!ok) {
    throw new AppError('Invalid email or password', HttpStatus.UNAUTHORIZED);
  }
  const tokens = await issueTokens(user);
  return { user: toAuthUser(user), tokens };
}

export async function refresh(rawToken: string) {
  const tokenHash = hashToken(rawToken);
  const stored = await RefreshToken.findOne({
    where: { tokenHash, revokedAt: { [Op.is]: null }, expiresAt: { [Op.gt]: new Date() } },
  });
  if (!stored) {
    throw new AppError('Invalid refresh token', HttpStatus.UNAUTHORIZED);
  }
  const user = await User.findByPk(stored.userId);
  if (!user) {
    throw new AppError('User no longer exists', HttpStatus.UNAUTHORIZED);
  }
  stored.revokedAt = new Date();
  await stored.save();
  const tokens = await issueTokens(user);
  return { user: toAuthUser(user), tokens };
}

export async function logout(rawToken?: string) {
  if (!rawToken) return;
  const stored = await RefreshToken.findOne({ where: { tokenHash: hashToken(rawToken) } });
  if (stored && !stored.revokedAt) {
    stored.revokedAt = new Date();
    await stored.save();
  }
}

export async function forgotPassword(email: string) {
  const user = await User.findOne({ where: { email } });
  if (!user) {
    return;
  }
  const raw = generateRawToken();
  await PasswordResetToken.create({
    userId: user.id,
    tokenHash: hashToken(raw),
    expiresAt: new Date(Date.now() + 60 * 60 * 1000),
    usedAt: null,
  });
  await enqueueEmail({
    to: user.email,
    subject: 'Reset your password',
    text: `Your password reset token is: ${raw}. It expires in 1 hour.`,
  });
}

export async function resetPassword(token: string, password: string) {
  const stored = await PasswordResetToken.findOne({
    where: { tokenHash: hashToken(token), usedAt: { [Op.is]: null }, expiresAt: { [Op.gt]: new Date() } },
  });
  if (!stored) {
    throw new AppError('Invalid or expired reset token', HttpStatus.BAD_REQUEST);
  }
  const user = await User.findByPk(stored.userId);
  if (!user) {
    throw new AppError('User no longer exists', HttpStatus.BAD_REQUEST);
  }
  user.password = await hashPassword(password);
  await user.save();
  stored.usedAt = new Date();
  await stored.save();
  await RefreshToken.update({ revokedAt: new Date() }, { where: { userId: user.id, revokedAt: { [Op.is]: null } } });
}

export async function googleLogin(idToken: string) {
  if (!googleClient || !env.GOOGLE_CLIENT_ID) {
    throw new AppError('Google auth is not configured', HttpStatus.SERVICE_UNAVAILABLE);
  }
  const ticket = await googleClient.verifyIdToken({ idToken, audience: env.GOOGLE_CLIENT_ID });
  const payload = ticket.getPayload();
  if (!payload?.email) {
    throw new AppError('Google token did not include an email', HttpStatus.UNAUTHORIZED);
  }
  let user = await User.findOne({
    where: { [Op.or]: [{ googleId: payload.sub }, { email: payload.email }] },
  });
  if (!user) {
    user = await User.create({
      name: payload.name || payload.email.split('@')[0],
      email: payload.email,
      password: null,
      googleId: payload.sub,
      isEmailVerified: Boolean(payload.email_verified),
      role: UserRole.USER,
    });
  } else if (!user.googleId) {
    user.googleId = payload.sub;
    user.isEmailVerified = user.isEmailVerified || Boolean(payload.email_verified);
    await user.save();
  }
  const tokens = await issueTokens(user);
  return { user: toAuthUser(user), tokens };
}

export const cookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: 'strict' as const,
  path: '/api/v1/auth',
  maxAge: parseDurationMs(env.JWT_REFRESH_EXPIRES_IN),
};
