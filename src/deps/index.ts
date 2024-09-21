import { createClient } from 'redis';
import { RedisService } from '../services';

export const redisService = new RedisService();

export const redisClient = createClient({
  url: `redis://${process.env.ELASTICACHE_ENDPOINT}:6379`,
}) as any;
