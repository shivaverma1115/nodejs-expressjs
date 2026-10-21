import { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';
import { UniqueConstraintError, ValidationError } from 'sequelize';
import { AppError } from '../errors/AppError';
import { HttpStatus } from '../constants/httpStatus';
import { isProduction } from '../../config/env';
import { logger } from '../../config/logger';

export function notFoundHandler(req: Request, _res: Response, next: NextFunction) {
  next(new AppError(`Route ${req.method} ${req.originalUrl} not found`, HttpStatus.NOT_FOUND));
}

export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  }

  if (err instanceof ZodError) {
    return res.status(HttpStatus.BAD_REQUEST).json({
      success: false,
      message: 'Validation failed',
      errors: err.flatten(),
    });
  }

  if (err instanceof UniqueConstraintError) {
    return res.status(HttpStatus.CONFLICT).json({
      success: false,
      message: 'Resource already exists',
    });
  }

  if (err instanceof ValidationError) {
    return res.status(HttpStatus.UNPROCESSABLE).json({
      success: false,
      message: err.message,
    });
  }

  logger.error({ err }, 'Unhandled error');

  return res.status(HttpStatus.INTERNAL_ERROR).json({
    success: false,
    message: isProduction ? 'Internal server error' : err instanceof Error ? err.message : 'Internal server error',
    ...(isProduction ? {} : { stack: err instanceof Error ? err.stack : undefined }),
  });
}
