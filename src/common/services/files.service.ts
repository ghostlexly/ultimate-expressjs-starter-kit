import path from "path";
import fs from "fs";
import FileType from "file-type"; // version 16.5.4
import crypto from "crypto";

const getMimeTypeFromExtension = (filePath: string): string => {
  const extension = path.extname(filePath).toLowerCase();

  const mimeTypes: { [key: string]: string } = {
    ".csv": "text/csv",
    ".txt": "text/plain",
    ".json": "application/json",
    ".xml": "application/xml",
    ".html": "text/html",
    ".css": "text/css",
    ".js": "application/javascript",
  };

  return mimeTypes[extension] || "application/octet-stream";
};

const getFileInfos = async ({
  filePath,
  originalFileName,
}: {
  filePath: string;
  originalFileName?: string;
}) => {
  try {
    const stats = fs.statSync(filePath);
    const fileTypeFromFile = await FileType.fromFile(filePath);
    let mimeType: string = fileTypeFromFile?.mime ?? "application/octet-stream";

    if (!fileTypeFromFile?.mime && originalFileName) {
      mimeType = getMimeTypeFromExtension(originalFileName);
    }

    return {
      filename: path.basename(filePath),
      path: filePath,
      size: stats.size,
      mimeType: mimeType,
    };
  } catch (error) {
    console.error("Error getting file details:", error);
    throw error;
  }
};

const getNormalizedFileName = (filename: string, appendRandom = true) => {
  // Remove special characters using path.normalize()
  const normalized = path.normalize(filename);

  const extension = path.extname(normalized);
  const baseName = path.basename(normalized, extension);

  let finalName: string;

  if (appendRandom) {
    // -- Add random number before the file extension
    // Generate a secure random string with 16 bytes (it's impossible to have a collision even with 100000000 billions of generated values)
    const random = crypto.randomBytes(16).toString("hex");

    finalName = `${baseName}-${random}${extension}`;
  } else {
    finalName = `${baseName}${extension}`;
  }

  // Remove whitespace and other characters using a regular expression
  const cleaned = finalName.replace(/[^a-zA-Z0-9.]+/g, "_");

  // Join directory and normalized filename components back together
  const normalizedFilename = path.join(path.dirname(normalized), cleaned);

  return normalizedFilename;
};

export const filesService = {
  getFileInfos,
  getMimeTypeFromExtension,
  getNormalizedFileName,
};
