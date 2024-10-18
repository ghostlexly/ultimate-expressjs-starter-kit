global.appRoot = path.resolve(__dirname);
import "reflect-metadata";
import express from "express";
import { apiRouter } from "./routes";
import { exceptionsMiddleware } from "./common/middlewares/exceptions.middleware";
import { unknownRoutesMiddleware } from "./common/middlewares/unknown-routes.middleware";
import { globalThrottler } from "./common/throttlers/global.throttler";
import { trimMiddleware } from "./common/middlewares/trim.middleware";
import { setupBearerStrategy } from "./modules/auth/strategies/bearer.strategy";
import { setupI18n } from "./common/lib/i18n";
import { setupSwagger } from "./common/lib/swagger";
import { setupCrons } from "./common/lib/crons";
import path from "path";

const app = express();

async function bootstrap() {
  // disable `x-powered-by` header for security reasons
  app.disable("x-powered-by");

  // Trust the `X-Forwarded-For` header for cloudflare and other reverse proxies
  // to send the real IP address of the client by this header.
  app.set("trust proxy", 1);

  // We parse the body of the request to be able to access it
  // @example: app.post('/', (req) => req.body.prop)
  app.use(express.json());

  // We parse the Content-Type `application/x-www-form-urlencoded`
  // ex: key1=value1&key2=value2.
  // to be able to access these forms's values in req.body
  app.use(express.urlencoded({ extended: true }));

  // We trim the body of the incoming requests to remove any leading or trailing whitespace
  app.use(trimMiddleware);

  // -- Swagger
  setupSwagger({ app });

  // -- Passport strategies
  setupBearerStrategy();

  // -- I18n
  setupI18n();

  // -- Crons
  setupCrons();

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
    console.log(`🚀 Server ready on port: 3000`);
  });
}

bootstrap();

export { app };
