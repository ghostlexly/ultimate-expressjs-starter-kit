import { NextFunction, Request, Response } from "express";
import { mediaService } from "../media.service";
import createHttpError from "http-errors";
import { optimizeVideoQueue } from "../queues/optimize-video/optimize-video.queue";
import { OPTIMIZE_VIDEO_JOB } from "../queues/optimize-video/optimize-video.job";

const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const file = req.file;

    if (!file) {
      throw new createHttpError.BadRequest("No file uploaded.");
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

const createVideo = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const file = req.file;

    if (!file) {
      throw new createHttpError.BadRequest("No file uploaded.");
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
    await optimizeVideoQueue.add(OPTIMIZE_VIDEO_JOB, { mediaId: media.id });

    return res.json({
      status: "success",
      id: media.id,
    });
  } catch (error) {
    next(error);
  }
};

export const mediaController = {
  create,
  createVideo,
};
