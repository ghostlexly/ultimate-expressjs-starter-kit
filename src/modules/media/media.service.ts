import { HttpError } from "@/common/lib/errors";
import { filesService } from "@/common/lib/files";
import { createLogger } from "@/common/lib/logger";
import { prisma } from "@/common/providers/database/prisma";
import { s3Service } from "@/common/providers/s3/s3";
import { Prisma } from "@prisma/client";
import { sub } from "date-fns";

export const createMediaService = () => {
  const logger = createLogger({ name: "mediaService" });

  /**
   * Save a file uploaded with Multer to S3 and create a media record.
   *
   * @param params.filePath The path to the file
   * @param params.originalFileName The original file name
   * @returns The media record
   */
  const uploadFileToS3 = async ({
    filePath,
    originalFileName,
  }: {
    filePath: string;
    originalFileName: string;
  }) => {
    const fileInfos = await filesService.getFileInfos(filePath);

    // -- Save the file to S3
    const fileKey = await s3Service.upload({
      filePath: filePath,
      fileName: originalFileName,
      mimeType: fileInfos.mimeType,
    });

    const media = await create({
      data: {
        fileKey: fileKey,
        fileName: originalFileName,
        mimeType: fileInfos.mimeType,
        size: fileInfos.size,
      },
    });

    return media;
  };

  const create = async ({ data }: { data: Prisma.MediaCreateInput }) => {
    // -- create
    const media = await prisma.media.create({
      data: {
        ...data,
      },
    });

    return media;
  };

  const remove = async ({ where }: { where: Prisma.MediaWhereUniqueInput }) => {
    // -- Get the record from the database
    const media = await prisma.media.findUnique({
      where: {
        ...where,
      },
    });

    if (!media) {
      throw new HttpError({
        status: 404,
        body: "Media to delete cannot be found.",
      });
    }

    // -- Delete the record from the database
    await prisma.media.delete({
      where: {
        id: media.id,
      },
    });
  };

  /**
   * Verify that the file has the correct size and type.
   * Throws an exception if the file does not meet the requirements.
   *
   * @param params.file The file to verify
   * @param params.allowedTypes The allowed MIME types
   * @param params.maxFileSize The maximum file size in Mo
   */
  const verifyMulterMaxSizeAndMimeType = async ({
    file,
    allowedMimeTypes,
    maxFileSize,
  }: {
    file: Express.Multer.File;
    allowedMimeTypes: string[];
    maxFileSize: number;
  }) => {
    const maxFileSizeInBytes = maxFileSize * 1024 * 1024; // Convert Mo to bytes
    const fileInfos = await filesService.getFileInfos(file.path);

    if (!allowedMimeTypes.includes(fileInfos.mimeType)) {
      throw new HttpError({
        status: 415,
        body: "This file type is not supported.",
      });
    }

    if (file.size > maxFileSizeInBytes) {
      throw new HttpError({
        status: 413,
        body: `The file size must not exceed ${maxFileSize} Mo.`,
      });
    }

    return true;
  };

  /**
   * Verify that the media has the correct size and type.
   * Throws an exception if the media does not meet the requirements.
   *
   * @param params.mediaId The media ID
   * @param params.allowedMimeTypes The allowed MIME types
   * @param params.maxFileSize The maximum file size in Mo
   */
  const verifyMediaMaxSizeAndMimeType = async ({
    mediaId,
    allowedMimeTypes,
    maxFileSize,
  }: {
    mediaId: string;
    allowedMimeTypes: string[];
    maxFileSize: number;
  }) => {
    const maxFileSizeInBytes = maxFileSize * 1024 * 1024; // Convert Mo to bytes

    const media = await prisma.media.findUnique({
      where: {
        id: mediaId,
      },
    });

    if (!media) {
      throw new HttpError({
        status: 404,
        body: "Media to verify cannot be found.",
      });
    }

    if (!allowedMimeTypes.includes(media.mimeType)) {
      throw new HttpError({
        status: 415,
        body: "This file type is not allowed.",
      });
    }

    if (media.size > maxFileSizeInBytes) {
      throw new HttpError({
        status: 413,
        body: `The file size must not exceed ${maxFileSize} Mo.`,
      });
    }

    return true;
  };

  /**
   * Remove orphan media records.
   * An orphan media record is a media record that is not linked to any other record.
   */
  const removeOrphanMedias = async () => {
    // -- Get the orphan media records
    const orphanMedias = await prisma.media.findMany({
      where: {
        AND: [
          // {
          //   propertyPhotos: {
          //     none: {},
          //   },
          // },
          // {
          //   propertyDocuments: {
          //     none: {},
          //   },
          // },
          // {
          //   propertyVideo: {
          //     none: {},
          //   },
          // },
          // {
          //   housekeeperAvatar: null,
          // },
          // {
          //   housekeeperDocumentsMedias: {
          //     none: {},
          //   },
          // },
          // {
          //   housekeeperInsurance: null,
          // },
        ],

        createdAt: {
          lt: sub(new Date(), { hours: 1 }), // older than 1 hour records
        },
      },
    });

    // -- Delete the orphan media records
    for (const media of orphanMedias) {
      logger.debug(
        `Deleting orphan media #${media.id} with FileKey [${media.fileKey}]...`
      );

      await remove({
        where: {
          id: media.id,
        },
      }).catch((err) => {
        logger.error(
          `Error deleting orphan media #${media.id}: ${err.message}`
        );
      });
    }
  };

  return {
    uploadFileToS3,
    create,
    remove,
    verifyMulterMaxSizeAndMimeType,
    verifyMediaMaxSizeAndMimeType,
    removeOrphanMedias,
  };
};
