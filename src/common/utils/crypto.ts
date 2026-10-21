import { createHash, randomBytes } from 'crypto';
import bcrypt from 'bcryptjs';

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 12);
}

export async function comparePassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export function hashToken(token: string) {
  return createHash('sha256').update(token).digest('hex');
}

export function generateRawToken(bytes = 32) {
  return randomBytes(bytes).toString('hex');
}
