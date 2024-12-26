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
const app = express();
const logger = createLogger({ name: "main" });

async function bootstrap() {
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

  // Swagger
  initializeSwagger({ app });

  // Passport strategies
  initializeBearerStrategy();

  // I18n
  initializeI18n();

  // Crons
  initializeCrons();

  // App Events
  eventsService.initialize();

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

  // Start server
  app.listen(3000, () => {
    // Log bootstrap time
    logger.info(`🕒 Bootstrap time: ${Date.now() - bootstrapStartTime}ms`);
    // Log server ready
    logger.info(`🚀 Server ready on port: 3000`);
  });
}

bootstrap();

export { app };
