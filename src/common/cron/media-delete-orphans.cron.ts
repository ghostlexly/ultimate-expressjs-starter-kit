import { Logger } from "@/common/utils/logger";
import { CronJob } from "cron";
import { prisma } from "@/common/database/prisma";
import { dateUtils } from "../utils/date";

const logger = new Logger("mediaDeleteOrphansCron");

/**
 * Remove orphan media records.
 * An orphan media record is a media record that is not linked to any other record.
 */
new CronJob(
  "0 0 */3 * * *",
  async () => {
    try {
      // -- Get the orphan media records
      const orphanMedias = await prisma.media.findMany({
        where: {
          AND: [
            // {
            //   housekeeperAvatar: null,
            // },
            // {
            //   housekeeperDocumentsMedias: {
            //     none: {},
            //   },
            // },
          ],

          createdAt: {
            lt: dateUtils.sub(new Date(), { hours: 24 }), // older than 24 hours records
          },
        },
      });

      // -- Delete the orphan media records
      for (const orphanMedia of orphanMedias) {
        logger.debug(
          `Deleting orphan media #${orphanMedia.id} with key [${orphanMedia.key}]...`
        );

        // -- Get the record from the database
        const media = await prisma.media.findUnique({
          where: {
            id: orphanMedia.id,
          },
        });

        if (!media) {
          logger.error(
            `Error deleting orphan media #${orphanMedia.id}: Media to delete cannot be found.`
          );
          throw new Error("Media to delete cannot be found.");
        }

        // -- Delete the record from the database
        await prisma.media
          .delete({
            where: {
              id: media.id,
            },
          })
          .catch((err) => {
            logger.error(
              `Error deleting orphan media #${media.id}: ${err.message}`
            );
          });
      }

      logger.debug("All orphan medias are been removed successfully.");
    } catch (error) {
      logger.error("Error during orphan media removal.", {
        error: error?.message,
        stack: error?.stack,
      });
    }
  },
  null,
  true,
  "Europe/Paris"
);
