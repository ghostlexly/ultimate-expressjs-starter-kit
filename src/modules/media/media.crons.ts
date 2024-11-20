import { createLogger } from "@/common/lib/logger";
import { MediaService } from "./media.service";
import { CronJob } from "cron";

const logger = createLogger({ name: "mediaCrons" });
const mediaService = new MediaService();

new CronJob(
  "0 0 */3 * * *",
  async () => {
    try {
      await mediaService.removeOrphanMedias();
      logger.debug("All orphan medias are been removed successfully.");
    } catch (error) {
      logger.error("Error during orphan media removal:", error);
    }
  },
  null,
  true,
  "Europe/Paris"
);
