import { Router } from 'express';
import { authenticate } from '../../common/middleware/authenticate';
import { validate } from '../../common/middleware/validate';
import * as postController from './post.controller';
import {
  createPostSchema,
  listPostsQuerySchema,
  patchPostSchema,
  postIdParamsSchema,
  replacePostSchema,
} from './post.schema';

const router = Router();

router.get('/', validate({ query: listPostsQuerySchema }), postController.list);
router.get('/:id', validate({ params: postIdParamsSchema }), postController.show);
router.post('/', authenticate, validate({ body: createPostSchema }), postController.create);
router.put('/:id', authenticate, validate({ params: postIdParamsSchema, body: replacePostSchema }), postController.replace);
router.patch('/:id', authenticate, validate({ params: postIdParamsSchema, body: patchPostSchema }), postController.patch);
router.delete('/:id', authenticate, validate({ params: postIdParamsSchema }), postController.remove);

export default router;
