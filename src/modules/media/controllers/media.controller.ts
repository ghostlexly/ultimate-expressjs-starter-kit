import { NextFunction, Request, Response } from "express";
import { mediaQueue } from "../queues/media.queue";
import { OPTIMIZE_VIDEO_JOB } from "../queues/optimize-video.job";
import { HttpException } from "@/common/errors/http-exception";
import { mediaService } from "../media.service";

export class MediaController {
  create = async (req: Request, res: Response, next: NextFunction) => {
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

  createVideo = async (req: Request, res: Response, next: NextFunction) => {
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

export const mediaController = new MediaController();
