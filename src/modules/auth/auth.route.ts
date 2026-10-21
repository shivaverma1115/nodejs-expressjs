import { Router } from 'express';
import { validate } from '../../common/middleware/validate';
import { authRateLimit } from '../../common/middleware/rateLimit';
import * as authController from './auth.controller';
import {
  forgotPasswordSchema,
  googleAuthSchema,
  loginSchema,
  refreshSchema,
  registerSchema,
  resetPasswordSchema,
} from './auth.schema';

const router = Router();

router.post('/register', authRateLimit, validate({ body: registerSchema }), authController.register);
router.post('/login', authRateLimit, validate({ body: loginSchema }), authController.login);
router.post('/refresh', validate({ body: refreshSchema }), authController.refresh);
router.post('/logout', authController.logout);
router.post('/forgot-password', authRateLimit, validate({ body: forgotPasswordSchema }), authController.forgotPassword);
router.post('/reset-password', validate({ body: resetPasswordSchema }), authController.resetPassword);
router.post('/google', authRateLimit, validate({ body: googleAuthSchema }), authController.google);

export default router;
