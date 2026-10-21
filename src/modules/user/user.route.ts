import { Router } from 'express';
import { authenticate } from '../../common/middleware/authenticate';
import { authorize } from '../../common/middleware/authorize';
import { validate } from '../../common/middleware/validate';
import { UserRole } from '../../common/constants/roles';
import * as userController from './user.controller';
import { adminUpdateUserSchema, listUsersQuerySchema, updateMeSchema, userIdParamsSchema } from './user.schema';

const router = Router();

router.get('/me', authenticate, userController.me);
router.patch('/me', authenticate, validate({ body: updateMeSchema }), userController.updateMe);
router.get('/', authenticate, authorize(UserRole.ADMIN), validate({ query: listUsersQuerySchema }), userController.list);
router.patch(
  '/:id',
  authenticate,
  authorize(UserRole.ADMIN),
  validate({ params: userIdParamsSchema, body: adminUpdateUserSchema }),
  userController.adminUpdate,
);
router.delete(
  '/:id',
  authenticate,
  authorize(UserRole.ADMIN),
  validate({ params: userIdParamsSchema }),
  userController.adminDelete,
);

export default router;
