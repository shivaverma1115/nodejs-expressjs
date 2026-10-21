import pino from 'pino';
import { env, isProduction } from './env';

export const logger = pino({
  level: isProduction ? 'info' : 'debug',
  base: { env: env.NODE_ENV },
});
