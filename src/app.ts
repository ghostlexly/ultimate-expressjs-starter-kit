import path from "path";
global.appRoot = path.resolve(__dirname);
import "dotenv/config";
import "reflect-metadata";
import express from "express";
import { apiRouter } from "#/presentation/routes";
import { exceptionsMiddleware } from "#/presentation/middlewares/exceptions.middleware";
import { unknownRoutesMiddleware } from "#/presentation/middlewares/unknown-routes.middleware";
import { globalThrottler } from "#/presentation/throttlers/global.throttler";
import { trimMiddleware } from "#/presentation/middlewares/trim.middleware";
import { initializeBearerStrategy } from "#/modules/auth/strategies/bearer.strategy";
import { rewriteIpAddressMiddleware } from "#/presentation/middlewares/rewrite-ip-address.middleware";
import { createLogger } from "#/shared/utils/logger";
import helmet from "helmet";
import cors from "cors";
import { initializeSwagger } from "./shared/utils/swagger";
import { initializeI18n } from "./shared/utils/i18n";
import { initializeCrons } from "./infrastructure/cron";
import { eventsService } from "./infrastructure/events/events.service";
import { appWorker, appQueue } from "./infrastructure/queue/bull/app.queue";
import { redisService } from "./infrastructure/cache/redis/redis";
import { prisma } from "./infrastructure/database/prisma";

const bootstrap = async () => {
  const app = express();
  const logger = createLogger({ name: "app" });

  // Log bootstrap time
  const bootstrapStartTime = Date.now();

  // Disable `x-powered-by` header for security reasons
  app.disable("x-powered-by");

  // Set view engine to ejs
  app.set("view engine", "ejs");

  // We parse the body of the request to be able to access it
  // @example: app.post('/', (req) => req.body.prop)
  app.use(express.json());

  // We parse the Content-Type `application/x-www-form-urlencoded`
  // ex: key1=value1&key2=value2.
  // to be able to access these forms's values in req.body
  app.use(express.urlencoded({ extended: true }));

  // Helmet is a collection of middlewares functions that set security-related headers
  app.use(
    helmet({
      crossOriginResourcePolicy: false, // We are already using CORS
    })
  );

  // Add CORS middleware
  app.use(cors()); // This will allow all origins in development

  // Rewrite ip address from cloudflare or other proxies
  app.use(rewriteIpAddressMiddleware);

  // We trim the body of the incoming requests to remove any leading or trailing whitespace
  app.use(trimMiddleware);

  // Passport strategies
  await initializeBearerStrategy();

  // I18n
  await initializeI18n();

  // App Events
  await eventsService.initialize();

  // Swagger
  initializeSwagger({ app });

  // Crons
  initializeCrons();

  // Static assets
  // We are using them in the PDF views
  app.use("/static", express.static(path.join(__dirname, "static")));

  // Routes
  app.use("/api", globalThrottler, apiRouter);

  // ----------------------------------------
  // Unknown routes handler
  // @important: Should be just before the last `app.use`
  // ----------------------------------------
  app.use(unknownRoutesMiddleware);

  // ----------------------------------------
  // Errors handler
  // @important: Should be the last `app.use`
  // ----------------------------------------
  app.use(exceptionsMiddleware);

  // Add shutdown handlers
  process.on("SIGTERM", () => cleanup());
  process.on("SIGINT", () => cleanup());
  process.on("beforeExit", () => cleanup());

  // Log bootstrap time
  logger.info(`🕒 Bootstrap time: ${Date.now() - bootstrapStartTime}ms`);

  return app;
};

if (require.main === module) {
  bootstrap();
}

// Cleanup the app connections before exiting
const cleanup = async () => {
  // Close all queue connections
  await Promise.all([appQueue.close(), appWorker.close()]);
  await Promise.all([appQueue.disconnect(), appWorker.disconnect()]);

  // Close Redis connection
  await redisService.quit();

  // Close Prisma connection
  await prisma.$disconnect();
};

export { bootstrap, cleanup };
