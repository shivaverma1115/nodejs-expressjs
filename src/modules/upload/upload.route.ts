import { Router } from 'express';
import { authenticate } from '../../common/middleware/authenticate';
import { uploadSingle } from '../../common/middleware/upload';
import * as uploadController from './upload.controller';

const router = Router();

router.post('/', authenticate, uploadSingle, uploadController.upload);

export default router;
