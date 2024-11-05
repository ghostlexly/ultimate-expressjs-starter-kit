import { Redis } from "ioredis";
import { configService } from "../../services/config.service";
import { createLogger } from "../../lib/logger";

const logger = createLogger({ name: "redis" });

export const REDIS_CONNECTION = {
  host: configService.getOrThrow("REDIS_HOST"),
  port: Number(configService.getOrThrow("REDIS_PORT")),
};

/** Load Redis */
let redisClient: Redis | null = null;

const getRedisClient = (): Redis => {
  if (!redisClient) {
    redisClient = new Redis(REDIS_CONNECTION);

    redisClient.on("error", (err) => {
      logger.error({ name: "redis", error: err });
    });

    redisClient.on("connect", () => {
      logger.info({ name: "redis" }, "Connected");
    });
  }

  return redisClient;
};

/**
 * Get a value from the cache. (JSON supported)
 *
 * @param key
 * @returns
 */
const get = async (key: string) => {
  const client = getRedisClient();
  const value = await client.get(key);
  return value ? JSON.parse(value) : null;
};

/**
 * Set a value in the cache with an optional expiration time. (JSON supported)
 *
 * @param key - The key to store the value under
 * @param value - The value to store
 * @param ttl - Time to live in seconds (optional)
 */
const set = async (key: string, value: any, ttl?: number) => {
  const client = getRedisClient();

  if (ttl) {
    await client.set(key, JSON.stringify(value), "EX", ttl);
  } else {
    await client.set(key, JSON.stringify(value));
  }
};

const deleteKey = async (key: string) => {
  const client = getRedisClient();
  return client.del(key);
};

const flushall = async () => {
  const client = getRedisClient();
  return client.flushall();
};

const quit = async () => {
  const client = getRedisClient();
  await client.quit();
  redisClient = null;
  logger.info({ name: "redis" }, "Connection closed");
};

export const redisService = {
  getRedisClient,
  get,
  set,
  delete: deleteKey,
  flushall,
  quit,
};
