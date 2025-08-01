import { prisma } from "@/common/database/prisma";
import { s3Service } from "@/common/storage/s3";
import { HttpException } from "@/common/exceptions/http-exception";
import { filesService } from "@/common/services/files.service";
import { Logger } from "@/common/utils/logger";
import { Express } from "express";

export class MediaService {
  private readonly logger = new Logger("mediaService");

  /**
   * Save a file uploaded with Multer to S3 and create a media record.
   *
   * @param params.filePath The path to the file
   * @param params.originalFileName The original file name
   * @returns The media record
   */
  uploadFileToS3 = async ({
    filePath,
    originalFileName,
  }: {
    filePath: string;
    originalFileName: string;
  }) => {
    const fileInfos = await filesService.getFileInfos({
      filePath,
      originalFileName,
    });

    // -- Save the file to S3
    const key = await s3Service.upload({
      filePath: filePath,
      fileName: originalFileName,
      mimeType: fileInfos.mimeType,
    });

    const media = await prisma.media.create({
      data: {
        key: key,
        fileName: originalFileName,
        mimeType: fileInfos.mimeType,
        size: fileInfos.size,
      },
    });

    return media;
  };

  /**
   * Verify that the file has the correct size and type.
   * Throws an exception if the file does not meet the requirements.
   *
   * @param params.file The file to verify
   * @param params.allowedTypes The allowed MIME types
   * @param params.maxFileSize The maximum file size in Mo
   */
  verifyMulterMaxSizeAndMimeType = async ({
    file,
    allowedMimeTypes,
    maxFileSize,
  }: {
    file: Express.Multer.File;
    allowedMimeTypes: string[];
    maxFileSize: number;
  }) => {
    const maxFileSizeInBytes = maxFileSize * 1_000_000; // Convert Mb to bytes
    const fileInfos = await filesService.getFileInfos({
      filePath: file.path,
      originalFileName: file.originalname,
    });

    if (!allowedMimeTypes.includes(fileInfos.mimeType)) {
      throw new HttpException({
        status: 415,
        message: "This file type is not supported.",
      });
    }

    if (file.size > maxFileSizeInBytes) {
      throw new HttpException({
        status: 413,
        message: `The file size must not exceed ${maxFileSize} Mb.`,
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
  verifyMediaMaxSizeAndMimeType = async ({
    mediaId,
    allowedMimeTypes,
    maxFileSize,
  }: {
    mediaId: string;
    allowedMimeTypes: string[];
    maxFileSize: number;
  }) => {
    const maxFileSizeInBytes = maxFileSize * 1_000_000; // Convert Mb to bytes

    const media = await prisma.media.findUnique({
      where: {
        id: mediaId,
      },
    });

    if (!media) {
      throw new HttpException({
        status: 404,
        message: "Media to verify cannot be found.",
      });
    }

    if (!allowedMimeTypes.includes(media.mimeType)) {
      throw new HttpException({
        status: 415,
        message: "This file type is not allowed.",
      });
    }

    if (media.size > maxFileSizeInBytes) {
      throw new HttpException({
        status: 413,
        message: `The file size must not exceed ${maxFileSize} Mo.`,
      });
    }

    return true;
  };
}

export const mediaService = new MediaService();
