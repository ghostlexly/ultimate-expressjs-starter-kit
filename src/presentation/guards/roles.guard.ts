import { Role } from "@prisma/client";
import { Request, Response, NextFunction } from "express";
import { HttpException } from "#/shared/exceptions/http-exception";

export const rolesGuard =
  (roles: Role[]) => (req: Request, res: Response, next: NextFunction) => {
    const account = req.context?.account;

    // -----------------------------------
    // Handle authentication failure
    // We provide 401 status code so the frontend can redirect to the login page
    // -----------------------------------
    if (!account) {
      return next(
        new HttpException({
          status: 401,
          message:
            "Authentication required. Please provide a valid access token.",
        })
      );
    }

    // -----------------------------------
    // Check if the user has the required role otherwise, throw a Forbidden error (403).
    // This status code indicates that the client is authenticated,
    // but it does not have the necessary permissions for the resource.
    // It's important to use 403 instead of 401 because 401 is for authentication failure.
    // -----------------------------------
    if (!roles.includes(account.role)) {
      return next(
        new HttpException({
          status: 403,
          message: "You don't have permission to access this resource.",
        })
      );
    }

    next();
  };
