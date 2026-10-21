import { NextFunction, Request, Response } from 'express';
import { AppError } from '../errors/AppError';
import { HttpStatus } from '../constants/httpStatus';
import { UserRole } from '../constants/roles';

export function authorize(...roles: UserRole[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      throw new AppError('Authentication required', HttpStatus.UNAUTHORIZED);
    }
    if (roles.length && !roles.includes(req.user.role)) {
      throw new AppError('You do not have permission to perform this action', HttpStatus.FORBIDDEN);
    }
    next();
  };
}
