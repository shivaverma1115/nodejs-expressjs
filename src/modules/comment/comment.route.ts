import { Router } from 'express';
import { authenticate } from '../../common/middleware/authenticate';
import { validate } from '../../common/middleware/validate';
import * as commentController from './comment.controller';
import {
  commentIdParamsSchema,
  createCommentSchema,
  listCommentsQuerySchema,
  patchCommentSchema,
  replaceCommentSchema,
} from './comment.schema';

const router = Router();

router.get('/', validate({ query: listCommentsQuerySchema }), commentController.list);
router.get('/:id', validate({ params: commentIdParamsSchema }), commentController.show);
router.post('/', authenticate, validate({ body: createCommentSchema }), commentController.create);
router.put(
  '/:id',
  authenticate,
  validate({ params: commentIdParamsSchema, body: replaceCommentSchema }),
  commentController.replace,
);
router.patch(
  '/:id',
  authenticate,
  validate({ params: commentIdParamsSchema, body: patchCommentSchema }),
  commentController.patch,
);
router.delete('/:id', authenticate, validate({ params: commentIdParamsSchema }), commentController.remove);

export default router;
