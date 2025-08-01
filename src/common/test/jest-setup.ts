import { appService } from "@/common/services/app.service";

afterAll(async () => {
  // Close all connections
  await appService.cleanup();
});
