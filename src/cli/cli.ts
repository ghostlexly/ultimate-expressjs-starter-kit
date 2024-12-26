import { Command } from "commander";
import path from "path";
import { getAppDir } from "#/shared/utils/app-dir";
import { glob } from "glob";
import { createLogger } from "#/shared/utils/logger";
import chalk from "chalk";

const logger = createLogger({ name: "cli" });
const program = new Command();

// Configure help output
program.configureHelp({
  subcommandTerm: (cmd) => chalk.yellow(cmd.name()),
  subcommandDescription: (cmd) => chalk.green(cmd.description()),
});

// Function to dynamically load commands
async function loadCommands() {
  const commandsPath = path.join(getAppDir(), "commands");

  console.log(commandsPath);

  const files = await glob("**/*.cli.js", { cwd: commandsPath });

  await Promise.all(
    files.map(async (file) => {
      const { default: commandModule } = await import(
        path.join(commandsPath, file)
      );

      if (typeof commandModule === "function") {
        commandModule(program);
      }
    })
  );
}

// Load commands and start the program
(async () => {
  await loadCommands();

  // Add a default action to handle the case where no command is specified
  program.action(() => {
    logger.info("No command specified.");
    program.outputHelp();
  });

  // Parse the command line arguments
  program.parse(process.argv);
})();
