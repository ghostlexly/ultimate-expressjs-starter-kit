/* eslint-disable @typescript-eslint/no-var-requires */
/**
  This worker is a new process that will be executed in the background.
  This process can't access any variable from the main process or any other files.
*/

const { TESTING_JOB, testingJob } = require("./testing.job");

module.exports = async (job) => {
  switch (job.name) {
    case TESTING_JOB:
      await testingJob(job);
      break;
    default:
      throw new Error(`Unknown job type: ${job.name}.`);
  }
};
