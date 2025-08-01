import * as Sentry from "@sentry/node";

Sentry.init({
  dsn: "SENTRY_DSN",
});
