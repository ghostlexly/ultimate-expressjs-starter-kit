import dotenv from "dotenv";
import { z } from "zod";

/**
 * Load environments variables from .env.${environment} possible values development || test
 * any environment that will be deployed will use the environment variables setup in the own environment
 */
const environment = process.env.NODE_ENV || "development";

dotenv.config({ path: [".env", `.env.${environment}`] });

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]),
  APP_BASE_URL: z.string().url(),
  APP_PORT: z.coerce.number().default(3000),
  APP_DATABASE_CONNECTION_URL: z.string().url(),
  APP_REDIS_HOST: z.string().min(1),
  APP_REDIS_PORT: z.coerce.number().default(6379),
  APP_JWT_PRIVATE_KEY: z.string().min(1),
  APP_JWT_PUBLIC_KEY: z.string().min(1),
  API_S3_ENDPOINT: z.string().url(),
  API_S3_ACCESS_KEY: z.string().min(1),
  API_S3_SECRET_KEY: z.string().min(1),
  API_S3_BUCKET: z.string().min(1),
  API_GOOGLE_CLIENT_ID: z.string().min(1),
  API_GOOGLE_CLIENT_SECRET: z.string().min(1),
  APP_PLAYWRIGHT_HEADLESS: z.coerce.boolean().default(true),
});

export const env = envSchema.parse(process.env);
