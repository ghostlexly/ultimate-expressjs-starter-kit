import { bootstrap } from "./app";
import { configService } from "./shared/services/config.service";
import { createLogger } from "./shared/utils/logger";

const logger = createLogger({ name: "server" });

const setup = async () => {
  try {
    const app = await bootstrap();
    const PORT = configService.getOrThrow("APP_PORT");

    // Start server
    app.listen(PORT, () => {
      // Log server ready
      logger.info(`🚀 Server ready on port: ${PORT}`);
    });
  } catch (error) {
    logger.error(error);
    process.exit(1);
  }
};

setup();
