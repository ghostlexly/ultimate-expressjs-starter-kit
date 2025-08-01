import {
  format,
  createLogger,
  transports,
  Logger as WinstonLogger,
} from "winston";
import { getRootDir } from "./app-dir";
import "winston-daily-rotate-file";

export class Logger {
  private logger: WinstonLogger;

  constructor(name: string) {
    const rootDir = getRootDir();

    // Custom format to make the error logs more human readable (inspired by Laravel)
    const humanReadableFormat = format.printf(
      ({ timestamp, level, message, ...meta }) => {
        // Format context (additional metadata)
        const context =
          Object.keys(meta).length > 0 ? ` ${JSON.stringify(meta)}` : "";

        return `[${timestamp}] ${
          process.env.NODE_ENV || "local"
        }.${level.toUpperCase()}: ${message}${context}`;
      }
    );

    this.logger = createLogger({
      level: "debug",

      // Add service name to the log
      defaultMeta: { service: name },

      format: format.combine(
        format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        format.errors({ stack: true }),
        humanReadableFormat
      ),

      transports: [
        // Console transport with colors
        new transports.Console({
          format: format.combine(format.colorize(), format.simple()),
        }),

        // Debug logs file
        new transports.DailyRotateFile({
          filename: `${rootDir}/logs/debug-%DATE%.log`,
          datePattern: "YYYY-MM-DD",
          maxFiles: "10",
          level: "debug",
        }),

        // Error logs file
        new transports.DailyRotateFile({
          filename: `${rootDir}/logs/error-%DATE%.log`,
          datePattern: "YYYY-MM-DD",
          maxFiles: "10",
          level: "error",
        }),
      ],
    });
  }

  error(message: string, ...meta: unknown[]) {
    this.logger.error(message, ...meta);
  }

  warn(message: string, ...meta: unknown[]) {
    this.logger.warn(message, ...meta);
  }

  info(message: string, ...meta: unknown[]) {
    this.logger.info(message, ...meta);
  }

  debug(message: string, ...meta: unknown[]) {
    this.logger.debug(message, ...meta);
  }
}
