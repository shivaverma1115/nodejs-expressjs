import { HttpStatus, HttpStatusCode } from '../constants/httpStatus';

export class AppError extends Error {
  public readonly statusCode: HttpStatusCode;
  public readonly isOperational: boolean;

  constructor(message: string, statusCode: HttpStatusCode = HttpStatus.INTERNAL_ERROR, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.name = 'AppError';
    Error.captureStackTrace(this, this.constructor);
  }
}
