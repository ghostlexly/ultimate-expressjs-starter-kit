import { NextFunction, Request, Response } from "express";
import { createLogger } from "#/shared/utils/logger";
import { HttpException } from "#/shared/exceptions/http-exception";
import { ValidationException } from "#/shared/exceptions/validation-exception";

const logger = createLogger({ name: "exceptions-middleware" });
const isDev = process.env.NODE_ENV === "development";

/**
 * Global error handling middleware
 *
 * @param err - The Express error (can be ours or another)
 * @param req - The initial request
 * @param res - The response object
 * @param next - Allows passing to the next middleware if it exists
 *
 * @see https://expressjs.com/en/guide/error-handling.html
 */
export const exceptionsMiddleware = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (res.headersSent) {
    return next(err);
  }

  if (err instanceof HttpException) {
    return res.status(err.status).json({
      code: err.code,
      message: err.message,
      stack: isDev ? err.stack : undefined,
      cause: isDev && err.cause ? (err.cause as Error).message : undefined,
    });
  }

  if (err instanceof ValidationException) {
    return res.status(err.status).json({
      code: err.code,
      message: err.message,
      violations: err.violations,
      stack: isDev ? err.stack : undefined,
      cause: isDev && err.cause ? (err.cause as Error).message : undefined,
    });
  }

  /** Log unhandled errors to a file */
  logger.fatal({
    url: req.protocol + "://" + req.hostname + req.originalUrl,
    message: err.message,
    stack: err.stack,
  });

  /**
   * In other cases, we return a 500
   */
  return res.status(500).json({ message: "Oops.. Internal Server Error" });
};
