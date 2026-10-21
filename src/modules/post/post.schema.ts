import { z } from 'zod';

export const createPostSchema = z.object({
  title: z.string().min(3).max(191),
  content: z.string().min(1),
  imageUrl: z.string().url().nullable().optional(),
  categoryId: z.coerce.number().int().positive(),
});

export const replacePostSchema = createPostSchema;

export const patchPostSchema = createPostSchema.partial();

export const postIdParamsSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export const listPostsQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().positive().max(100).optional(),
  sort: z.string().optional(),
  search: z.string().optional(),
  categoryId: z.coerce.number().int().positive().optional(),
  userId: z.coerce.number().int().positive().optional(),
});
