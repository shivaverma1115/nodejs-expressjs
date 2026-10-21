import path from 'path';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import hpp from 'hpp';
import pinoHttp from 'pino-http';
import { env } from './config/env';
import { logger } from './config/logger';
import { requestId } from './common/middleware/requestId';
import { apiRateLimit } from './common/middleware/rateLimit';
import { errorHandler, notFoundHandler } from './common/middleware/errorHandler';
import authRoutes from './modules/auth/auth.route';
import userRoutes from './modules/user/user.route';
import postRoutes from './modules/post/post.route';
import categoryRoutes from './modules/category/category.route';
import commentRoutes from './modules/comment/comment.route';
import uploadRoutes from './modules/upload/upload.route';
import healthRoutes from './modules/health/health.route';

const app = express();

app.set('trust proxy', 1);
app.use(requestId);
// app.use(
//   pinoHttp({
//     logger,
//     genReqId: (req) => (req as express.Request).requestId || '',
//   }),
// );
app.use(helmet());
app.use(
  cors({
    origin: env.CORS_ORIGIN.split(',').map((value) => value.trim()),
    credentials: true,
  }),
);
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(hpp());
app.use(apiRateLimit);
app.use('/uploads', express.static(path.resolve(env.UPLOAD_DIR)));

app.use('/health', healthRoutes);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/posts', postRoutes);
app.use('/api/v1/categories', categoryRoutes);
app.use('/api/v1/comments', commentRoutes);
app.use('/api/v1/uploads', uploadRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
