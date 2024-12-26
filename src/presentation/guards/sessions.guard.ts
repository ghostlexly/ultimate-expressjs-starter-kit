import { NextFunction, Request, Response } from "express";
import passport from "passport";
import { HttpException } from "#/shared/exceptions/http-exception";

/**
  Block everything if the user is not authenticated and the route is not public
  get the user from the token and add it to the request.
  @example app.get('/', (req) => req.context?.account)
*/
export const sessionsGuard = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Call passport authentication mechanism
  await passport.authenticate("bearer", { session: false }, (err, user) => {
    // -- Handle middleware error
    if (err) {
      return next(err);
    }

    // -- Handle authentication failure
    // -- We provide 401 status code so the frontend can redirect to the login page
    if (!user) {
      return next(
        new HttpException({
          status: 401,
          message:
            "Authentication required. Please provide a valid access token.",
        })
      );
    }

    // -- Handle authentication success
    req.context = {
      account: user,
    };
    next();
  })(req, res, next);
};
