import http from 'http';
import { env } from './config/env';
import { logger } from './config/logger';
import app from './app';
import { closeDatabase, connectDatabase } from './database/sequelize';
import './database/models';
import { closeRedis, connectRedis } from './cache/redis';
import { closeJobs, startJobs } from './jobs/queues';

const server = http.createServer(app);

async function bootstrap() {
  await connectDatabase();
  // await connectRedis();
  // await startJobs();

  server.listen(env.PORT, () => {
    logger.info(`Server is running on port ${env.PORT} (${env.NODE_ENV})`);
  });
}

async function shutdown(signal: string) {
  logger.info({ signal }, 'Shutting down');
  server.close(async () => {
    await closeJobs();
    await closeRedis();
    await closeDatabase();
    process.exit(0);
  });
}

process.on('SIGINT', () => void shutdown('SIGINT'));
process.on('SIGTERM', () => void shutdown('SIGTERM'));

bootstrap().catch((error) => {
  logger.error({ err: error }, 'Failed to start server');
  process.exit(1);
});
