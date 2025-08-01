import { Command } from "commander";
import { Logger } from "@/common/utils/logger";
import { prisma } from "@/common/database/prisma";
import { authService } from "@/common/services/auth.service";

const LOGGER = new Logger("create-admin-account-command");

const setupCommand = (program: Command): void => {
  program
    .command("create:admin-account")
    .description("Create an admin account.")
    .argument("<email>", "Email")
    .argument("<password>", "Password")
    .action(runCommand);
};

const runCommand = async (email: string, password: string): Promise<void> => {
  const hashedPassword = await authService.hashPassword({ password });

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

  LOGGER.info("Account created successfully.");
  process.exit(0);
};

export default setupCommand;
