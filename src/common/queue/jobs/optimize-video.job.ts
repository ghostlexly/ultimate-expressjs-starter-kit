import { Logger } from "@/common/utils/logger";
import { prisma } from "@/common/database/prisma";
import { SandboxedJob } from "bullmq";
import path from "path";
import os from "os";
import crypto from "crypto";
import { s3Service } from "@/common/storage/s3";
import { FfmpegService } from "@/common/utils/ffmpeg";

export const optimizeVideoJob = async (job: SandboxedJob) => {
  const logger = new Logger("optimizeVideoJob");
  const ffmpegService = new FfmpegService();

  const { mediaId } = job.data;

  // -- get media
  const media = await prisma.media.findFirst({
    where: { id: mediaId },
  });

  if (!media) {
    throw new Error(`Media ${mediaId} not found.`);
  }

  // -- download the video file from S3
  logger.info(`Downloading video file ${mediaId}...`);

  const tempVideoFilePath = path.join(
    os.tmpdir(),
    `${crypto.randomUUID()}_${media.fileName}`
  );

  await s3Service.downloadToFile({
    key: media.key,
    destinationPath: tempVideoFilePath,
  });

  // -- optimize the video file with ffmpeg
  logger.info(`Optimizing video file ${mediaId}...`);

  const fileNameMp4 = media.fileName.replace(/\.[^.]+$/, ".mp4");
  const destVideoFilePath = path.join(
    os.tmpdir(),
    `${crypto.randomUUID()}_${fileNameMp4}`
  );

  await ffmpegService.processVideoEncoding({
    inputFilePath: tempVideoFilePath,
    outputFilePath: destVideoFilePath,
  });

  // -- upload the optimized video file to S3
  logger.info(`Uploading optimized video file ${mediaId}...`);

  const newKey = await s3Service.upload({
    filePath: destVideoFilePath,
    fileName: fileNameMp4,
    mimeType: "video/mp4",
  });

  // -- update the media record with the new file key
  await prisma.media.update({
    where: { id: mediaId },
    data: { key: newKey, mimeType: "video/mp4", fileName: fileNameMp4 },
  });

  // -- delete the previous file from S3
  await s3Service.deleteFile({ key: media.key });

  logger.info(
    `Optimized video file ${mediaId} uploaded to S3 as ${newKey} successfully.`
  );
};
