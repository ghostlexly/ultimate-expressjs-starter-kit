import { glob } from "glob";
import path from "path";
import { createLogger } from "./logger";
import { getAppDir } from "./app-dir";

const logger = createLogger({ name: "initializeCrons" });

export const initializeCrons = async () => {
  const modulesPath = path.join(getAppDir(), "modules");

  const files = await glob("**/*.crons.{ts,js}", {
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
