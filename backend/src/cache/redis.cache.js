import { createClient } from "redis";
import { logger } from "../utils/logger.js";
import { ENV } from "../config/env.js";

class RedisCache {
  constructor() {
    this.client = null;
    this.isConnected = false;
  }

  async connect() {
    try {
      this.client = createClient({ url: ENV.REDIS_URL });
      this.client.on("error", (err) => {
        logger.error("Redis Client Error", err.message);
        this.isConnected = false;
      });
      this.client.on("connect", () => {
        logger.info("Redis connecting...");
      });
      this.client.on("ready", () => {
        logger.info("Redis client connected and ready!");
        this.isConnected = true;
      });

      await this.client.connect();
    } catch (err) {
      logger.warn("Failed to connect to Redis. Falling back to memory cache.", err.message);
      this.isConnected = false;
    }
  }

  async get(key) {
    if (!this.isConnected) return null;
    try {
      const data = await this.client.get(key);
      return data ? JSON.parse(data) : null;
    } catch (err) {
      logger.error(`Redis GET error for key ${key}`, err);
      return null;
    }
  }

  async set(key, value, ttlSeconds = 300) {
    if (!this.isConnected) return false;
    try {
      await this.client.set(key, JSON.stringify(value), {
        EX: ttlSeconds,
      });
      return true;
    } catch (err) {
      logger.error(`Redis SET error for key ${key}`, err);
      return false;
    }
  }

  async del(key) {
    if (!this.isConnected) return false;
    try {
      await this.client.del(key);
      return true;
    } catch (err) {
      logger.error(`Redis DEL error for key ${key}`, err);
      return false;
    }
  }

  async keys(pattern) {
    if (!this.isConnected) return [];
    try {
      return await this.client.keys(pattern);
    } catch (err) {
      logger.error(`Redis KEYS error for pattern ${pattern}`, err);
      return [];
    }
  }

  async delPattern(pattern) {
    if (!this.isConnected) return false;
    try {
      const matchingKeys = await this.keys(pattern);
      if (matchingKeys.length > 0) {
        await this.client.del(matchingKeys);
      }
      return true;
    } catch (err) {
      logger.error(`Redis delPattern error for pattern ${pattern}`, err);
      return false;
    }
  }
}

export const redisCache = new RedisCache();
