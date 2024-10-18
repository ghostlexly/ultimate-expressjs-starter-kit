import { Request, Response, NextFunction } from "express";

export const trimMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.body) {
    req.body = trimObject(req.body);
  }
  next();
};

const trimObject = (obj: any): any => {
  if (typeof obj !== "object" || obj === null) {
    return obj;
  }

  return Object.keys(obj).reduce((acc: any, key: string) => {
    const value = obj[key];
    if (typeof value === "string") {
      acc[key] = value.trim();
    } else if (Array.isArray(value)) {
      acc[key] = value.map(trimObject);
    } else if (typeof value === "object") {
      acc[key] = trimObject(value);
    } else {
      acc[key] = value;
    }
    return acc;
  }, {});
};
