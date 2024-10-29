import { loggerService } from "@/common/lib/logger";
import cron from "node-cron";
import { createMediaService } from "./media.service";

const logger = loggerService.create({ name: "mediaCrons" });
const mediaService = createMediaService();

cron.schedule("0 * * * *", async () => {
  try {
    await mediaService.removeOrphanMedias();
    logger.debug("All orphan medias are been removed successfully.");
  } catch (error) {
    logger.error("Error during orphan media removal:", error);
  }
});
