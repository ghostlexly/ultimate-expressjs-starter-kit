export const initializeCrons = () => {
  // -- We don't want to run crons in the test environment
  if (process.env.NODE_ENV === "test") return;

  import("./media-delete-orphans.cron");
};
