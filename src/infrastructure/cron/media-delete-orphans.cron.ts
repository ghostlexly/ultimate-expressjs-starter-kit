import { createLogger } from "#/shared/utils/logger";
import { CronJob } from "cron";
import { sub } from "date-fns";
import { prisma } from "../database/prisma";

const logger = createLogger({ name: "mediaDeleteOrphansCron" });

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
            lt: sub(new Date(), { hours: 1 }), // older than 1 hour records
          },
        },
      });

      // -- Delete the orphan media records
      for (const orphanMedia of orphanMedias) {
        logger.debug(
          `Deleting orphan media #${orphanMedia.id} with FileKey [${orphanMedia.fileKey}]...`
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
      logger.error("Error during orphan media removal:", error);
    }
  },
  null,
  true,
  "Europe/Paris"
);
