import { z } from 'zod';

export const createCommentSchema = z.object({
  content: z.string().min(1),
  postId: z.coerce.number().int().positive(),
});

export const replaceCommentSchema = z.object({
  content: z.string().min(1),
  postId: z.coerce.number().int().positive(),
});

export const patchCommentSchema = z.object({
  content: z.string().min(1).optional(),
});

export const commentIdParamsSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export const listCommentsQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().positive().max(100).optional(),
  sort: z.string().optional(),
  postId: z.coerce.number().int().positive().optional(),
  userId: z.coerce.number().int().positive().optional(),
});
