import { Response, Request, NextFunction } from "express";

/**
 * Rewrite request's ip address with the real ip address received from cloudflare or other proxies.
 * If you need a library to get the real ip address @see: https://www.npmjs.com/package/request-ip
 */
export const rewriteIpAddressMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // -- cloudflare
  const cfConnectingIp = req.headers["cf-connecting-ip"];

  if (cfConnectingIp) {
    req.clientIp = cfConnectingIp as string;
  }

  next();
};
