import { NextFunction, Request, Response } from "express";
import { mediaQueue } from "../queues/media.queue";
import { OPTIMIZE_VIDEO_JOB } from "../queues/optimize-video.job";
import { HttpException } from "@/common/lib/errors";
import { MediaService } from "../media.service";

export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const file = req.file;

      if (!file) {
        throw new HttpException({
          status: 400,
          body: "No file uploaded.",
        });
      }

      // -- verify the file
      await this.mediaService.verifyMulterMaxSizeAndMimeType({
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
      const media = await this.mediaService.uploadFileToS3({
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

  createVideo = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const file = req.file;

      if (!file) {
        throw new HttpException({
          status: 400,
          body: "No file uploaded.",
        });
      }

      // -- verify the file
      await this.mediaService.verifyMulterMaxSizeAndMimeType({
        file: file,
        allowedMimeTypes: ["video/mp4", "video/quicktime"],
        maxFileSize: 100,
      });

      // -- upload the file to S3
      const media = await this.mediaService.uploadFileToS3({
        filePath: file.path,
        originalFileName: file.originalname,
      });

      // -- optimize the video file with ffmpeg and reupload it to S3
      await mediaQueue.add(OPTIMIZE_VIDEO_JOB, { mediaId: media.id });

      return res.json({
        status: "success",
        id: media.id,
      });
    } catch (error) {
      next(error);
    }
  };
}
