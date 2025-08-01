import { Command } from "commander";
import { Logger } from "@/common/utils/logger";
import { redisService } from "@/common/services/redis.service";

const LOGGER = new Logger("redis-clear-command");

const setupCommand = (program: Command): void => {
  program
    .command("redis:clear")
    .description("Clear Redis cache.")
    .action(runCommand);
};

const runCommand = async (): Promise<void> => {
  try {
    await redisService.flushall();
    LOGGER.info("All Redis keys have been cleared successfully.");
  } catch (error) {
    LOGGER.error("An error occured during Redis keys clearing.", {
      error: error?.message,
      stack: error?.stack,
    });
  }

  process.exit(0);
};

export default setupCommand;
