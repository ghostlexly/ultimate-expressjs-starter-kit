import { NextFunction, Request, Response } from "express";
import { mediaService } from "../media.service";
import { HttpException } from "#/shared/exceptions/http-exception";
import { appQueue } from "#/infrastructure/queue/bull/app.queue";
import { OPTIMIZE_VIDEO_JOB } from "#/infrastructure/queue/bull/jobs/optimize-video.job";

export class MediaController {
  onUploadMedia = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const file = req.file;

      if (!file) {
        throw new HttpException({
          status: 400,
          message: "No file uploaded.",
        });
      }

      // -- verify the file
      await mediaService.verifyMulterMaxSizeAndMimeType({
        file: file,
        allowedMimeTypes: [
          "image/jpeg",
          "image/jpg",
          "image/png",
          "application/pdf",
        ],
        maxFileSize: 50,
      });

      // -- upload the file to S3
      const media = await mediaService.uploadFileToS3({
        filePath: file.path,
        originalFileName: file.originalname,
      });

      return res.json({
        status: "success",
        id: media.id,
      });
    } catch (error) {
      next(error);
    }
  };

  onUploadVideo = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const file = req.file;

      if (!file) {
        throw new HttpException({
          status: 400,
          message: "No file uploaded.",
        });
      }

      // -- verify the file
      await mediaService.verifyMulterMaxSizeAndMimeType({
        file: file,
        allowedMimeTypes: ["video/mp4", "video/quicktime"],
        maxFileSize: 100,
      });

      // -- upload the file to S3
      const media = await mediaService.uploadFileToS3({
        filePath: file.path,
        originalFileName: file.originalname,
      });

      // -- optimize the video file with ffmpeg and reupload it to S3
      await appQueue.add(OPTIMIZE_VIDEO_JOB, { mediaId: media.id });

      return res.json({
        status: "success",
        id: media.id,
      });
    } catch (error) {
      next(error);
    }
  };
}

export const mediaController = new MediaController();
