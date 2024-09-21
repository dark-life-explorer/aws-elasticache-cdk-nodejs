import { RedisClientType } from 'redis';

import { redisService, redisClient } from './deps';

/**
 * It's just a simple example working with elasticache
 *
 * 1. connect to the redis if connection is not established yet
 * 2. make calls against database.
 * 3. optional step - to close connection if action is single and there is no need ti leave connections for next lambda executions.
 */
export const handler = async () => {
  if (!redisService.clientExists()) {
    redisClient.on('error', (err: any) => console.error('Redis Client Error', err));
    redisClient.on('connect', () => console.info('Redis Client Connected'));

    await redisClient.connect();
    redisService.setClient(redisClient as RedisClientType);
  }

  redisService.setItem('1', { name: 'poweruser' });
  const powerUser = redisService.getItem('1');

  console.log(powerUser);

  /**
   * Optional Step: close the connection
   */
  redisClient.quit();
};
