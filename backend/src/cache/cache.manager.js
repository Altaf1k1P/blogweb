import { redisCache } from "./redis.cache.js";
import { memoryCache } from "./memory.cache.js";
import { logger } from "../utils/logger.js";

class CacheManager {
  constructor() {
    this.redisClient = redisCache;
    this.memoryClient = memoryCache;
  }

  async init() {
    await this.redisClient.connect();
  }

  get client() {
    return this.redisClient.isConnected ? this.redisClient : this.memoryClient;
  }

  async get(key) {
    const activeClient = this.client;
    const value = await activeClient.get(key);
    if (value) {
      logger.debug(`Cache HIT for key: ${key}`);
    } else {
      logger.debug(`Cache MISS for key: ${key}`);
    }
    return value;
  }

  async set(key, value, ttlSeconds = 300) {
    const activeClient = this.client;
    return await activeClient.set(key, value, ttlSeconds);
  }

  async del(key) {
    const activeClient = this.client;
    return await activeClient.del(key);
  }

  async invalidatePattern(pattern) {
    logger.info(`Invalidating cache pattern: ${pattern}`);
    // Invalidate both in case of hybrid states
    await this.redisClient.delPattern(pattern);
    await this.memoryClient.delPattern(pattern);
    return true;
  }
}

export const cacheManager = new CacheManager();
