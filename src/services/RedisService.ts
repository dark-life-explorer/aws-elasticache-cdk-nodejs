/* eslint-disable sonarjs/no-duplicate-string */
import { RedisClientType, RedisFlushModes } from 'redis';

/**
 * The service is design to manipulate simple data with redis storage.
 *
 * @category Service
 */
export class RedisService {
  private redisClient;

  constructor(client?: RedisClientType) {
    this.redisClient = client;
  }

  /**
   * Client to communicate with redis storage.
   * @param {RedisClientType} client
   */
  setClient(client?: RedisClientType) {
    this.redisClient = client;
  }

  /**
   * Whether redis client is defined.
   */
  clientExists() {
    return !!this.redisClient;
  }

  /**
   * Update item with specified id.
   * @param itemId  Unique identifier of the item.
   * @param item Data to save.
   */
  setItem(itemId: string, item: Record<string, any>) {
    return this.redisClient?.json.set(`root:${itemId}`, '$', item);
  }

  /**
   *
   * @param itemId Unique identifier of the item.
   * @returns Returns item by specified id. 'null' if item does not exist.
   */
  async getItem(itemId: string) {
    return this.redisClient?.json.get(`root:${itemId}`);
  }

  /**
   * Delete specified item by id.
   *
   * @param itemId Unique identifier of the item to delete.
   */
  deleteItem(itemId: string) {
    return this.redisClient?.json.del(`root:${itemId}`);
  }

  /**
   * Delete all items from redis.
   */
  deleteAllItems() {
    return this.redisClient?.flushAll(RedisFlushModes.ASYNC);
  }
}
