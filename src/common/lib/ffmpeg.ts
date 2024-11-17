import { spawn } from "child_process";

export class FfmpegService {
  /**
   * Process the video encoding with ffmpeg to optimize the video file for all web browsers.
   *
   * Safari compatibility requires: -vf "format=yuv420p"
   */
  processVideoEncoding = async ({ inputFilePath, outputFilePath }) => {
    return new Promise((resolve, reject) => {
      const ffmpegProcess = spawn(
        `ffmpeg -i "${inputFilePath}" -c:v libx264 -preset fast -crf 26 -vf "format=yuv420p" -c:a aac -b:a 128k -movflags +faststart -f mp4 "${outputFilePath}"`,
        { shell: true }
      );

      let stdout = "";
      let stderr = "";

      ffmpegProcess.stdout.on("data", (data) => {
        stdout += data.toString();
      });

      ffmpegProcess.stderr.on("data", (data) => {
        stderr += data.toString();
      });

      ffmpegProcess.on("close", (code) => {
        if (code === 0) {
          resolve({ stdout, stderr });
        } else {
          reject(
            new Error(
              `FFmpeg process exited with code ${code}\nStderr: ${stderr}`
            )
          );
        }
      });

      ffmpegProcess.on("error", (err) => {
        reject(err);
      });
    });
  };
}
