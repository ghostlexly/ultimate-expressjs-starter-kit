import { Command } from "commander";
import { Logger } from "@/common/utils/logger";

const LOGGER = new Logger("test-command");

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

  LOGGER.info("Splited text successfully", {
    splitedText,
  });

  process.exit(0);
};

export default setupCommand;
