import { z } from 'zod';
import { UserRole } from '../../common/constants/roles';

export const listUsersQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().positive().max(100).optional(),
  sort: z.string().optional(),
  search: z.string().optional(),
  role: z.enum([UserRole.USER, UserRole.ADMIN]).optional(),
});

export const userIdParamsSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export const updateMeSchema = z.object({
  name: z.string().min(2).max(120).optional(),
});

export const adminUpdateUserSchema = z.object({
  name: z.string().min(2).max(120).optional(),
  role: z.enum([UserRole.USER, UserRole.ADMIN]).optional(),
  isEmailVerified: z.boolean().optional(),
});
