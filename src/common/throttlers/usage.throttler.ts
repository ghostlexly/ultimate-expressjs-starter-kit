import rateLimit from "express-rate-limit";

export const usageThrottler = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minutes
  max: 5, // Limit each IP to X requests per `windowMs`
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: {
    message:
      "You have reached the maximum number of requests for your plan. Please try again later or contact support if you believe this is an error.",
  },
  keyGenerator: (req) => {
    // Use both IP address and user email as the key
    const ip = req.clientIp;
    let email = "unknown";

    if (req.account?.customer?.email) {
      email = req.account.customer.email;
    }

    return `${ip}-${email}`;
  },
});
