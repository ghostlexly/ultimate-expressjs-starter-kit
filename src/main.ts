import path from "path";
global.appRoot = path.resolve(__dirname);
import "dotenv/config";
import "reflect-metadata";
import express from "express";
import { apiRouter } from "#/routes";
import { exceptionsMiddleware } from "#/common/middlewares/exceptions.middleware";
import { unknownRoutesMiddleware } from "#/common/middlewares/unknown-routes.middleware";
import { globalThrottler } from "#/common/throttlers/global.throttler";
import { trimMiddleware } from "#/common/middlewares/trim.middleware";
import { initializeBearerStrategy } from "#/modules/auth/strategies/bearer.strategy";
import { initializeI18n } from "#/common/lib/i18n";
import { initializeSwagger } from "#/common/lib/swagger";
import { initializeCrons } from "#/common/lib/crons";
import { rewriteIpAddressMiddleware } from "#/common/middlewares/rewrite-ip-address.middleware";
import { createLogger } from "#/common/lib/logger";
import { eventsService } from "#/common/services/events.service";
import helmet from "helmet";
import cors from "cors";
const app = express();
const logger = createLogger({ name: "main" });

async function bootstrap() {
  // -- Log bootstrap time
  const bootstrapStartTime = Date.now();

  // disable `x-powered-by` header for security reasons
  app.disable("x-powered-by");

  // We parse the body of the request to be able to access it
  // @example: app.post('/', (req) => req.body.prop)
  app.use(express.json());

  // We parse the Content-Type `application/x-www-form-urlencoded`
  // ex: key1=value1&key2=value2.
  // to be able to access these forms's values in req.body
  app.use(express.urlencoded({ extended: true }));

  // -- Helmet is a collection of middlewares functions that set security-related headers
  app.use(
    helmet({
      crossOriginResourcePolicy: false, // We are already using CORS
    })
  );

  // -- Add CORS middleware
  app.use(cors()); // This will allow all origins in development

  // -- Rewrite ip address from cloudflare or other proxies
  app.use(rewriteIpAddressMiddleware);

  // We trim the body of the incoming requests to remove any leading or trailing whitespace
  app.use(trimMiddleware);

  // -- Swagger
  initializeSwagger({ app });

  // -- Passport strategies
  initializeBearerStrategy();

  // -- I18n
  initializeI18n();

  // -- Crons
  initializeCrons();

  // -- App Events
  eventsService.initialize();

  // -- Static assets
  // We are using them in the PDF templates
  app.use("/static", express.static(path.join(__dirname, "static")));

  // -- Routes
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

  // -- Start server
  app.listen(3000, () => {
    // -- Log bootstrap time
    logger.info(`🕒 Bootstrap time: ${Date.now() - bootstrapStartTime}ms`);
    // -- Log server ready
    logger.info(`🚀 Server ready on port: 3000`);
  });
}

bootstrap();

export { app };
