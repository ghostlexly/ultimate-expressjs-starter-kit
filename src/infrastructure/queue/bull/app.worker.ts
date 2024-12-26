/**
  This worker is a new process that will be executed in the background.
  This process can't access any variable from the main process or any other files.
*/

import { SandboxedJob } from "bullmq";
import { TESTING_JOB, testingJob } from "./jobs/testing.job";

export default async (job: SandboxedJob) => {
  switch (job.name) {
    case TESTING_JOB:
      await testingJob(job);
      break;

    default:
      throw new Error(`Unknown job type: ${job.name}.`);
  }
};
