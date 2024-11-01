import * as FileStreamRotator from "file-stream-rotator";
import pino from "pino";
import pretty from "pino-pretty";
import { getRootDir } from "./app-dir";

export const createLogger = ({ name }: { name: string }) => {
  const rootDir = getRootDir();

  const streams = [
    {
      // output to STDOUT (console)
      level: "debug",
      stream: pretty({
        colorize: true,
        levelFirst: true,
      }),
    },

    {
      level: "debug",
      stream: FileStreamRotator.getStream({
        filename: `${rootDir}/logs/debug-%DATE%.log`,
        frequency: "daily",
        date_format: "YYYY-MM-DD",
        max_logs: "10",
      }),
    },
    {
      level: "error",
      stream: FileStreamRotator.getStream({
        filename: `${rootDir}/logs/error-%DATE%.log`,
        frequency: "daily",
        date_format: "YYYY-MM-DD",
        max_logs: "10",
      }),
    },
  ];

  const logger = pino(
    {
      level: "debug", // this MUST be set at the lowest level of the destinations
      formatters: {
        level: (label) => {
          return { level: label.toUpperCase() }; // Uppercase log levels
        },

        // This is the default formatter, we use it to remove pid by default
        bindings(bindings) {
          return { hostname: bindings.hostname };
        },
      },

      // transform timestamp to ISO string representation to make it human readable
      timestamp: pino.stdTimeFunctions.isoTime,
    },
    pino.multistream(streams)
  );

  return logger.child({ name: name });
};
