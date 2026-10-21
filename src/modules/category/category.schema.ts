import { z } from 'zod';

export const createCategorySchema = z.object({
  name: z.string().min(2).max(120),
});

export const replaceCategorySchema = createCategorySchema;
export const patchCategorySchema = createCategorySchema.partial();

export const categoryIdParamsSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export const listCategoriesQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().positive().max(100).optional(),
  sort: z.string().optional(),
  search: z.string().optional(),
});
