import { NextFunction, Request, Response } from "express";
import passport from "passport";
import { HttpException } from "@/common/exceptions/http-exception";
import { CustomAccount } from "@/common/types/request";

/**
  Block everything if the user is not authenticated and the route is not public
  get the user from the token and add it to the request.
  Checks for JWT token in Authorization header first, then falls back to URL query params (?token=)
  @example app.get('/', (req) => req.context?.account)
*/
export const sessionsGuard = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Extract Authorization header
  const authHeader = req.headers.authorization;

  // If the authorization header is not present, try to get the token from the url query params or cookies
  if (!authHeader) {
    // Try to get the token from the url query params
    const queryToken = req.query?.["token"];
    if (queryToken) {
      req.headers.authorization = `Bearer ${queryToken}`;
    }

    // Try to get the token from the cookies
    if (!queryToken) {
      const cookieToken = req.cookies?.["lunisoft_access_token"];

      if (cookieToken) {
        req.headers.authorization = `Bearer ${cookieToken}`;
      }
    }
  }

  // Call passport authentication mechanism
  await passport.authenticate(
    "jwt",
    { session: false },
    (err: Error, user: CustomAccount) => {
      // Handle middleware error
      if (err) {
        return next(err);
      }

      // Handle authentication failure
      // We provide 401 status code so the frontend can redirect to the login page
      if (!user) {
        return next(
          HttpException.unauthorized({
            message:
              "Authentication required. Please provide a valid access token.",
          })
        );
      }

      // Handle authentication success
      req.context = {
        account: user,
      };
      next();
    }
  )(req, res, next);
};
