import { Request, Response, NextFunction } from "express";

// Define types for values that can be trimmed
type TrimmableValue = string | TrimmableObject | TrimmableValue[];
interface TrimmableObject {
  [key: string]: TrimmableValue;
}

/**
 * Middleware that trims all string values in the request body
 * Handles nested objects, arrays, and primitive values
 */
export const trimMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (req.body) {
    req.body = trimObject(req.body);
  }
  next();
};

/**
 * Trims a value based on its type
 * @param value - The value to trim (string, array, or object)
 * @returns The trimmed value
 */
const trimValue = (value: TrimmableValue): TrimmableValue => {
  if (typeof value === "string") {
    return value.trim();
  }

  if (Array.isArray(value)) {
    return value.map(trimValue);
  }

  if (typeof value === "object" && value !== null) {
    return trimObject(value);
  }

  return value;
};

/**
 * Recursively trims all string values in an object
 * @param obj - The object to process
 * @returns A new object with all string values trimmed
 */
const trimObject = <T extends TrimmableObject>(obj: T): T => {
  if (typeof obj !== "object" || obj === null) {
    return obj;
  }

  const trimmedObj = Object.entries(obj).reduce(
    (acc: Partial<T>, [key, value]: [string, TrimmableValue]) => ({
      ...acc,
      [key]: trimValue(value),
    }),
    {}
  );

  return trimmedObj as T;
};
