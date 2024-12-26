import { Command } from "commander";
import { createLogger } from "#/shared/utils/logger";

const logger = createLogger({ name: "test-command" });

const setupCommand = (program: Command): void => {
  program
    .command("test:split-text")
    .description("Split a text into an array.")
    .option("--first", "Limit to first item")
    .option("-s, --separator <char>", "Specify separator character", ",")
    .argument("<text>", "Text to split")
    .action(runCommand);
};

type CommandOptions = {
  first?: boolean;
  separator: string;
};

const runCommand = async (
  text: string,
  options: CommandOptions
): Promise<void> => {
  const limit = options.first ? 1 : undefined;
  const separator = options.separator;

  const splitedText = text.split(separator, limit).map((part) => part.trim());

  logger.info(
    {
      splitedText,
    },
    "Splited text successfully"
  );

  process.exit(0);
};

export default setupCommand;
