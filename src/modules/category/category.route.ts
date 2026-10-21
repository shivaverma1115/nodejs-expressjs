import { Router } from 'express';
import { authenticate } from '../../common/middleware/authenticate';
import { authorize } from '../../common/middleware/authorize';
import { validate } from '../../common/middleware/validate';
import { UserRole } from '../../common/constants/roles';
import * as categoryController from './category.controller';
import {
  categoryIdParamsSchema,
  createCategorySchema,
  listCategoriesQuerySchema,
  patchCategorySchema,
  replaceCategorySchema,
} from './category.schema';

const router = Router();

router.get('/', validate({ query: listCategoriesQuerySchema }), categoryController.list);
router.get('/:id', validate({ params: categoryIdParamsSchema }), categoryController.show);
router.post('/', authenticate, authorize(UserRole.ADMIN), validate({ body: createCategorySchema }), categoryController.create);
router.put(
  '/:id',
  authenticate,
  authorize(UserRole.ADMIN),
  validate({ params: categoryIdParamsSchema, body: replaceCategorySchema }),
  categoryController.replace,
);
router.patch(
  '/:id',
  authenticate,
  authorize(UserRole.ADMIN),
  validate({ params: categoryIdParamsSchema, body: patchCategorySchema }),
  categoryController.patch,
);
router.delete(
  '/:id',
  authenticate,
  authorize(UserRole.ADMIN),
  validate({ params: categoryIdParamsSchema }),
  categoryController.remove,
);

export default router;
