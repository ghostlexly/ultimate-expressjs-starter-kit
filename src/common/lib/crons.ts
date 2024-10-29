import { glob } from "glob";
import path from "path";
import { createLoggerService } from "./logger";
import { getAppDir } from "./app-dir";

const logger = createLoggerService({ name: "setupCrons" });

export const setupCrons = async () => {
  const modulesPath = path.join(getAppDir(), "modules");

  const files = await glob("**/*.crons.js", {
    cwd: modulesPath,
  });

  await Promise.all(
    files.map(async (file) => {
      const filePath = path.join(modulesPath, file);
      await import(filePath);
      logger.info(`Loaded [${file}] cron job(s).`);
    })
  );
};
