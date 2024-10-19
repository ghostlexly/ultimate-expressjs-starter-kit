import { Command } from "commander";
import { loggerService } from "../lib/logger";
import { prisma } from "../providers/database/prisma";
import * as bcrypt from "bcryptjs";

const logger = loggerService.create({ name: "create-admin-account-command" });

const setupCommand = (program: Command): void => {
  program
    .command("create:admin-account")
    .description("Create an admin account.")
    .argument("<email>", "Email")
    .argument("<password>", "Password")
    .action(runCommand);
};

const runCommand = async (email: string, password: string): Promise<void> => {
  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.admin.create({
    data: {
      email: email,
      password: hashedPassword,
      account: {
        create: {
          role: "ADMIN",
        },
      },
    },
  });

  logger.info("Account created successfully.");
};

export default setupCommand;
