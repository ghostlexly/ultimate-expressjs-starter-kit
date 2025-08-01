import { bootstrap } from "./app";
import { Logger } from "./common/utils/logger";
import { env } from "./config";
const logger = new Logger("server");

const setup = async () => {
  try {
    const app = await bootstrap();
    const PORT = env.APP_PORT;

    // Start server
    app.listen(PORT, () => {
      // Log server ready
      logger.info(`🚀 Server ready on port: ${PORT}`);
    });
  } catch (error) {
    logger.error("An error occured on the server.", {
      error: error?.message,
      stack: error?.stack,
    });
    process.exit(1);
  }
};

setup();
