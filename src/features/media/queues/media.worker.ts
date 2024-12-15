/**
  This worker is a new process that will be executed in the background.
  This process can't access any variable from the main process or any other files.
*/

import { SandboxedJob } from "bullmq";
import { OPTIMIZE_VIDEO_JOB, optimizeVideoJob } from "./optimize-video.job";

export default async (job: SandboxedJob) => {
  switch (job.name) {
    case OPTIMIZE_VIDEO_JOB:
      await optimizeVideoJob(job);
      break;
    default:
      throw new Error(`Unknown job type: ${job.name}.`);
  }
};
