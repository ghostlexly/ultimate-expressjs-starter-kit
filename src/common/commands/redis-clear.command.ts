import { Command } from "commander";
import { loggerService } from "../lib/logger";
import { redisService } from "../providers/cache/redis";

const logger = loggerService.create({ name: "redis-clear-command" });

const setupCommand = (program: Command): void => {
  program
    .command("redis:clear")
    .description("Clear Redis cache.")
    .action(runCommand);
};

const runCommand = async (): Promise<void> => {
  try {
    await redisService.flushall();
    logger.info("All Redis keys have been cleared successfully.");
  } catch (error) {
    logger.error("Error clearing Redis keys:", error);
  }

  process.exit(0);
};

export default setupCommand;
