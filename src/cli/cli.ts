import { Command } from "commander";
import path from "path";
import { getAppDir } from "@/common/utils/app-dir";
import { glob } from "glob";
import { Logger } from "@/common/utils/logger";
import chalk from "chalk";
import { appService } from "@/common/services/app.service";

const logger = new Logger("cli");
const program = new Command();

// Configure help output
program.configureHelp({
  subcommandTerm: (cmd) => chalk.yellow(cmd.name()),
  subcommandDescription: (cmd) => chalk.green(cmd.description()),
});

// Function to dynamically load commands
async function loadCommands() {
  const commandsPath = path.join(getAppDir(), "cli", "commands");

  const files = await glob("**/*.command.js", { cwd: commandsPath });

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

  // Parse the command line arguments and await the result
  await program.parseAsync(process.argv);

  // Only shutdown after command completion
  await appService.shutdownGracefully();
})();
