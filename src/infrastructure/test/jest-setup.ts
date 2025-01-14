import { cleanup } from "#/app";

afterAll(async () => {
  // Close all connections
  await cleanup();
});
