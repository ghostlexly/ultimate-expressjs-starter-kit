import rateLimit from "express-rate-limit";
import { Request } from "express";

export const globalThrottler = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minutes
  max: 500, // Limit each IP to X requests per `windowMs`
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  keyGenerator: (req: Request) => {
    // Use the ip address given by the proxy
    return req.clientIp || req.ip || req.socket?.remoteAddress || "anonymous";
  },
  message: { message: "Too many requests, please try again later." },
});
