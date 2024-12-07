/* eslint-disable @typescript-eslint/no-var-requires */
/**
  This worker is a new process that will be executed in the background.
  This process can't access any variable from the main process or any other files.
*/

const {
  OPTIMIZE_VIDEO_JOB,
  optimizeVideoJob,
} = require("./optimize-video.job");

module.exports = async (job) => {
  switch (job.name) {
    case OPTIMIZE_VIDEO_JOB:
      await optimizeVideoJob(job);
      break;
    default:
      throw new Error(`Unknown job type: ${job.name}.`);
  }
};
