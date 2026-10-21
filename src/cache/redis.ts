import Redis from 'ioredis';
import { env } from '../config/env';
import { logger } from '../config/logger';

let redis: Redis | null = null;
let redisReady = false;

export function getRedis(): Redis | null {
  return redisReady ? redis : null;
}

export async function connectRedis(): Promise<Redis | null> {
  if (!env.REDIS_URL) {
    logger.warn('REDIS_URL is empty — cache and background jobs will be skipped');
    return null;
  }

  redis = new Redis(env.REDIS_URL, {
    maxRetriesPerRequest: null,
    lazyConnect: true,
  });

  redis.on('error', (err) => {
    redisReady = false;
    logger.warn({ err }, 'Redis error — continuing without cache/jobs');
  });

  try {
    await redis.connect();
    redisReady = true;
    logger.info('Redis connected');
    return redis;
  } catch (error) {
    redisReady = false;
    logger.warn({ err: error }, 'Redis connection failed — cache and jobs disabled');
    redis.disconnect();
    redis = null;
    return null;
  }
}

export async function closeRedis() {
  if (redis) {
    await redis.quit();
    redis = null;
    redisReady = false;
    logger.info('Redis connection closed');
  }
}

export async function cacheGet<T>(key: string): Promise<T | null> {
  const client = getRedis();
  if (!client) return null;
  const raw = await client.get(key);
  if (!raw) {
    logger.debug({ key }, 'cache miss');
    return null;
  }
  logger.debug({ key }, 'cache hit');
  return JSON.parse(raw) as T;
}

export async function cacheSet(key: string, value: unknown, ttlSeconds = 60) {
  const client = getRedis();
  if (!client) return;
  await client.set(key, JSON.stringify(value), 'EX', ttlSeconds);
}

export async function cacheDelByPrefix(prefix: string) {
  const client = getRedis();
  if (!client) return;
  const keys = await client.keys(`${prefix}*`);
  if (keys.length) {
    await client.del(...keys);
  }
}
