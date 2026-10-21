import { Response } from 'express';
import { HttpStatus, HttpStatusCode } from '../constants/httpStatus';

export function sendSuccess<T>(
  res: Response,
  data: T,
  message = 'Success',
  statusCode: HttpStatusCode = HttpStatus.OK,
) {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
}

export function sendPaginated<T>(
  res: Response,
  data: T[],
  meta: { page: number; limit: number; total: number; totalPages: number },
  message = 'Success',
) {
  return res.status(HttpStatus.OK).json({
    success: true,
    message,
    data,
    meta,
  });
}
