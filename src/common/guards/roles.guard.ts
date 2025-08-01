import { Role } from "@/generated/prisma/client";
import { Request, Response, NextFunction } from "express";
import { HttpException } from "@/common/exceptions/http-exception";

export const rolesGuard =
  (roles: Role[]) => (req: Request, res: Response, next: NextFunction) => {
    const account = req.context?.account;

    /**
     * Check if the user is logged in
     * otherwise, throw an Unauthorized error (401).
     * This status code indicates that the client is not authenticated.
     */
    if (!account) {
      return next(
        HttpException.unauthorized({
          message:
            "Authentication required. Please provide a valid access token.",
        })
      );
    }

    /**
     * Check if the user has the required role otherwise, throw a Forbidden error (403).
     * This status code indicates that the client is authenticated,
     * but it does not have the necessary permissions for the resource.
     */
    if (!roles.includes(account.role)) {
      return next(
        HttpException.forbidden({
          message: "You don't have permission to access this resource.",
        })
      );
    }

    next();
  };
