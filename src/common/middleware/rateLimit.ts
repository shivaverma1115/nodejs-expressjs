import { rateLimit } from 'express-rate-limit';
import { HttpStatus } from '../constants/httpStatus';

export const apiRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 minutes
  limit: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests, please try again later' },
  statusCode: HttpStatus.TOO_MANY_REQUESTS,
});

export const authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 minutes
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many auth attempts, please try again later' },
  statusCode: HttpStatus.TOO_MANY_REQUESTS,
});
