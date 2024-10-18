import { Redis } from "ioredis";
import { configService } from "../../lib/config";
import { loggerService } from "../../lib/logger";

const logger = loggerService.create({ name: "redis" });

export const REDIS_CONNECTION = {
  host: configService.getOrThrow("REDIS_HOST"),
  port: Number(configService.getOrThrow("REDIS_PORT")),
};

/** Load Redis */
export const redisClient = new Redis(REDIS_CONNECTION);

redisClient.on("error", (err) => {
  logger.error({ name: "redis", error: err });
});

redisClient.on("connect", () => {
  logger.info({ name: "redis" }, "Connected");
});

/**
 * Get a value from the cache. (JSON supported)
 * @param key
 * @returns
 */
const get = async (key: string) => {
  const value = await redisClient.get(key);
  return value ? JSON.parse(value) : null;
};

/**
 * Set a value in the cache with an optional expiration time. (JSON supported)
 * @param key - The key to store the value under
 * @param value - The value to store
 * @param ttl - Time to live in seconds (optional)
 */
const set = async (key: string, value: any, ttl?: number) => {
  if (ttl) {
    await redisClient.set(key, JSON.stringify(value), "EX", ttl);
  } else {
    await redisClient.set(key, JSON.stringify(value));
  }
};

export const redisService = { get, set, delete: redisClient.del };
