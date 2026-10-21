import { Sequelize } from 'sequelize';
import { env } from '../config/env';
import { logger } from '../config/logger';

export const sequelize = new Sequelize(env.DB_NAME, env.DB_USER, env.DB_PASSWORD, {
  host: env.DB_HOST,
  port: env.DB_PORT,
  dialect: 'mysql',
  logging: env.NODE_ENV === 'development' ? (msg) => logger.debug(msg) : false,
  define: {
    underscored: false,
  },
});

export async function connectDatabase() {
  try {
    await sequelize.authenticate();
    logger.info(`Database connected (${env.NODE_ENV} / ${env.DB_NAME} @ ${env.DB_HOST}:${env.DB_PORT})`);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    logger.error({ err: error }, `Database connection failed: ${message}`);
    process.exit(1);
  }
}

export async function closeDatabase() {
  await sequelize.close();
  logger.info('Database connection closed');
}
