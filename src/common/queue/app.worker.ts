/**
  This worker is a new process that will be executed in the background.
  This process can't access any variable from the main process or any other files.
*/

import { SandboxedJob } from "bullmq";
import { testingJob } from "./jobs/testing.job";
import { optimizeVideoJob } from "./jobs/optimize-video.job";

type JobHandler = (job: SandboxedJob) => Promise<void>;

const jobs: Record<string, JobHandler> = {
  testingJob,
  optimizeVideoJob,
};

export default async (job: SandboxedJob) => {
  const handler = jobs[job.name];

  if (!handler) {
    throw new Error(`Unknown job type: ${job.name}`);
  }

  await handler(job);
};
