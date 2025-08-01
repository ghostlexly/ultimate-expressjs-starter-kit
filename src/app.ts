import "./instrument";
import path from "path";
import "dotenv/config";
import "reflect-metadata";
import { exceptionsMiddleware } from "@/common/middlewares/exceptions.middleware";
import { rewriteIpAddressMiddleware } from "@/common/middlewares/rewrite-ip-address.middleware";
import { trimMiddleware } from "@/common/middlewares/trim.middleware";
import { unknownRoutesMiddleware } from "@/common/middlewares/unknown-routes.middleware";
import { apiRoutes } from "@/routes";
import { globalThrottler } from "@/common/throttlers/global.throttler";
import { Logger } from "@/common/utils/logger";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import { initializeCrons } from "./common/cron";
import { initializeJwtStrategy } from "./modules/auth/strategies/jwt.strategy";
import cookieParser from "cookie-parser";
import * as Sentry from "@sentry/node";
import { initializeZod } from "./common/utils/zod";
import { queueService } from "./common/queue/queue.service";

const bootstrap = async () => {
  const app = express();
  const logger = new Logger("app");

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

  // Parse cookies
  app.use(cookieParser());

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
  await initializeJwtStrategy();

  // Crons
  initializeCrons();

  // Zod
  initializeZod();

  // Queue Service (BullMQ workers and queues)
  queueService.initialize();

  // Static assets
  // We are using them in the PDF views
  app.use("/static", express.static(path.join(__dirname, "static")));

  // Routes
  app.use("/api", globalThrottler, apiRoutes);

  // ----------------------------------------
  // Unknown routes handler
  // @important: Should be just before the last `app.use`
  // ----------------------------------------
  app.use(unknownRoutesMiddleware);

  // ----------------------------------------
  // Errors handler
  // @important: Should be the last `app.use`
  // ----------------------------------------
  Sentry.setupExpressErrorHandler(app);
  app.use(exceptionsMiddleware);

  // Log bootstrap time
  if (process.env.NODE_ENV !== "test") {
    logger.info(`🕒 Bootstrap time: ${Date.now() - bootstrapStartTime}ms`);
  }

  return app;
};

if (require.main === module) {
  bootstrap();
}

export { bootstrap };
