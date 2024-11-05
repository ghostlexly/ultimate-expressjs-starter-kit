import path from "path";
import fs from "fs";
import FileType from "file-type"; // version 16.5.4
import crypto from "crypto";

const getFileInfos = async (filePath: string) => {
  try {
    const stats = fs.statSync(filePath);
    const fileType = await FileType.fromFile(filePath);

    return {
      filename: path.basename(filePath),
      path: filePath,
      size: stats.size,
      mimeType: fileType ? fileType.mime : "application/octet-stream",
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

export const filesService = { getFileInfos, getNormalizedFileName };
