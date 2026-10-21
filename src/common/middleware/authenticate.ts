import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../../config/env';
import { AppError } from '../errors/AppError';
import { HttpStatus } from '../constants/httpStatus';
import { UserRole } from '../constants/roles';

type AccessPayload = {
  sub: number;
  email: string;
  role: UserRole;
  type: 'access';
};

export function authenticate(req: Request, _res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    throw new AppError('Authentication required', HttpStatus.UNAUTHORIZED);
  }

  const token = header.slice(7);
  try {
    const payload = jwt.verify(token, env.JWT_ACCESS_SECRET) as unknown as AccessPayload;
    if (payload.type !== 'access') {
      throw new AppError('Invalid access token', HttpStatus.UNAUTHORIZED);
    }
    req.user = { id: payload.sub, email: payload.email, role: payload.role };
    next();
  } catch {
    throw new AppError('Invalid or expired access token', HttpStatus.UNAUTHORIZED);
  }
}

export function optionalAuth(req: Request, _res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    return next();
  }
  try {
    const payload = jwt.verify(header.slice(7), env.JWT_ACCESS_SECRET) as unknown as AccessPayload;
    if (payload.type === 'access') {
      req.user = { id: payload.sub, email: payload.email, role: payload.role };
    }
  } catch {
    /* ignore invalid optional tokens */
  }
  next();
}
