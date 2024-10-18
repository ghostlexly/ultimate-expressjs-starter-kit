import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import passport from "passport";

/**
  Block everything if the user is not authenticated and the route is not public
  get the user from the token and add it to the request.
  @example app.get('/', (req) => req.account)
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
    if (!user) {
      return next(createHttpError.Forbidden("Unauthorized"));
    }

    // -- Handle authentication success
    req.account = user;
    next();
  })(req, res, next);
};
