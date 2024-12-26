import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
  StorageClass,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { configService } from "#/shared/services/config.service";
import fs from "fs";
import path from "path";
import { filesService } from "#/shared/services/files.service";
import { format } from "date-fns";
import { HttpException } from "#/shared/exceptions/http-exception";

const client = new S3Client({
  endpoint: configService.getOrThrow("API_S3_ENDPOINT"),
  region: "auto", // [ex for AWS: eu-west-3] [ex for Cloudflare: auto]
  credentials: {
    accessKeyId: configService.getOrThrow("API_S3_ACCESS_KEY"),
    secretAccessKey: configService.getOrThrow("API_S3_SECRET_KEY"),
  },
});

const bucketName = configService.getOrThrow("API_S3_BUCKET");

/**
 * Save a file to S3 bucket and create a record in the database
 *
 * @param filePath The path to the file
 * @param fileName The name of the file to store in S3
 * @param mimeType The MIME type of the file
 * @param storageClass The storage class of the file in S3. [STANDARD_IA] (Standard Infrequent Access) is 2x cheaper than STANDARD for still good performance || [STANDARD] is the default for frequent access
 *
 * @returns The fileKey in S3
 */
const upload = async ({
  filePath,
  fileName,
  mimeType,
  storageClass = "STANDARD_IA",
}: {
  filePath: string;
  fileName: string;
  mimeType: string;
  storageClass?: StorageClass;
}) => {
  const buffer = fs.readFileSync(filePath);
  const normalizedFileName = filesService.getNormalizedFileName(fileName);

  const fileKey = path.join(
    format(new Date(), "yyyy"),
    format(new Date(), "MM"),
    format(new Date(), "dd"),
    normalizedFileName
  );

  // -- Save to S3
  await client.send(
    new PutObjectCommand({
      Bucket: bucketName,
      Key: fileKey,
      Body: buffer,
      StorageClass: storageClass,
      ContentType: mimeType,
    })
  );

  return fileKey;
};

/**
 * Download a file from S3 to /tmp directory and return the path
 * @param params.fileKey The key of the file in S3
 * @param params.destinationPath The path to save the downloaded file
 * @returns The path to the downloaded file
 */
const downloadToFile = async ({
  fileKey,
  destinationPath,
}: {
  fileKey: string;
  destinationPath?: string;
}) => {
  if (!destinationPath) {
    destinationPath = path.join("/tmp", path.basename(fileKey));
  }

  const data = await client.send(
    new GetObjectCommand({
      Bucket: bucketName,
      Key: fileKey,
    })
  );

  if (!data.Body) {
    throw new HttpException({
      status: 404,
      message: "File not found.",
    });
  }

  const fileWriteStream = fs.createWriteStream(destinationPath);

  const stream = new WritableStream({
    write(chunk) {
      fileWriteStream.write(chunk);
    },
    close() {
      fileWriteStream.close();
    },
    abort(err) {
      fileWriteStream.destroy(err);
      throw err;
    },
  });

  // You cannot await just the pipeTo() because you must wait for
  // both pipeTo AND createWriteStream to finish.
  await new Promise((resolve, reject) => {
    fileWriteStream.on("finish", resolve);
    fileWriteStream.on("error", reject);
    data.Body?.transformToWebStream().pipeTo(stream);
  });

  return destinationPath;
};

/**
 * Download a file from S3 to memory and return the base64 string
 */
const downloadToMemoryBase64 = async ({ fileKey }: { fileKey: string }) => {
  const data = await client.send(
    new GetObjectCommand({
      Bucket: bucketName,
      Key: fileKey,
    })
  );

  if (!data.Body) {
    throw new HttpException({
      status: 404,
      message: "File not found.",
    });
  }

  const contentType = data.ContentType;
  const streamToString = await data.Body.transformToString("base64");

  return {
    contentType,
    base64: streamToString,
  };
};

/**
 * Delete a file from S3 bucket
 */
const deleteFile = async ({ fileKey }: { fileKey: string }) => {
  await client.send(
    new DeleteObjectCommand({
      Bucket: bucketName,
      Key: fileKey,
    })
  );
};

/**
 * Get a presigned URL to upload a file to a S3 bucket
 */
const getPresignedUploadUrl = async ({
  fileKey,
  storageClass = "STANDARD_IA",
}: {
  fileKey: string;
  storageClass?: StorageClass;
}) => {
  const presignedUrl = await getSignedUrl(
    client,
    new PutObjectCommand({
      Bucket: bucketName,
      Key: fileKey,
      StorageClass: storageClass,
    }),
    { expiresIn: 1800 } // 30 minutes
  );

  return presignedUrl;
};

export const s3Service = {
  upload,
  downloadToFile,
  downloadToMemoryBase64,
  deleteFile,
  getPresignedUploadUrl,
};
