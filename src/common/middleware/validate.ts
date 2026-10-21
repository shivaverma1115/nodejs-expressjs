import { NextFunction, Request, Response } from 'express';
import { ZodType } from 'zod';

type Schemas = {
  body?: ZodType;
  query?: ZodType;
  params?: ZodType;
};

export function validate(schemas: Schemas) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (schemas.body) {
      req.body = schemas.body.parse(req.body);
    }
    if (schemas.query) {
      const parsed = schemas.query.parse(req.query);
      Object.assign(req.query, parsed);
    }
    if (schemas.params) {
      req.params = schemas.params.parse(req.params) as typeof req.params;
    }
    next();
  };
}
