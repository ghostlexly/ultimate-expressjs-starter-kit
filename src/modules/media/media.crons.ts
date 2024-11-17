import { createLogger } from "@/common/lib/logger";
import cron from "node-cron";
import { MediaService } from "./media.service";

const logger = createLogger({ name: "mediaCrons" });
const mediaService = new MediaService();

cron.schedule("0 * * * *", async () => {
  try {
    await mediaService.removeOrphanMedias();
    logger.debug("All orphan medias are been removed successfully.");
  } catch (error) {
    logger.error("Error during orphan media removal:", error);
  }
});
