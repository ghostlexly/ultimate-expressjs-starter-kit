import rateLimit from "express-rate-limit";

export const strictThrottler = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minutes
  max: 10, // Limit each IP to X requests per `windowMs`
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  keyGenerator: (req) => {
    // Use the ip address given by the proxy
    return req.clientIp;
  },
  message: { message: "Too many requests, please try again later." },
});
