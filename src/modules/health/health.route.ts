import { Router } from 'express';
import { sequelize } from '../../database/sequelize';
import { getRedis } from '../../cache/redis';
import { HttpStatus } from '../../common/constants/httpStatus';
import { asyncHandler } from '../../common/utils/asyncHandler';
import { sendSuccess } from '../../common/utils/apiResponse';
import { apiRateLimit } from '../../common/middleware/rateLimit';

const router = Router();

router.get('/', (_req, res) => {
  sendSuccess(res, { status: 'ok', uptime: process.uptime() }, 'API is running');
});

router.get(
  '/ready',
  asyncHandler(async (_req, res) => {
    let database = 'down';
    let redis = 'down';
    try {
      await sequelize.authenticate();
      database = 'up';
    } catch {
      database = 'down';
    }
    const client = getRedis();
    if (client) {
      try {
        const pong = await client.ping();
        redis = pong === 'PONG' ? 'up' : 'down';
      } catch {
        redis = 'down';
      }
    } else {
      redis = 'disabled';
    }
    const ready = database === 'up';
    const payload = { database, redis };
    if (!ready) {
      res.status(HttpStatus.SERVICE_UNAVAILABLE).json({
        success: false,
        message: 'Service not ready',
        data: payload,
      });
      return;
    }
    sendSuccess(res, payload, 'Service ready');
  }),
);

export default router;
