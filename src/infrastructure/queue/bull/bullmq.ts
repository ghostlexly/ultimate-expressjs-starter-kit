import { Job, Worker } from "bullmq";
import { createLogger } from "#/shared/utils/logger";

type initWorkerEventsLoggerProps = {
  worker: Worker;
};

const initWorkerEventsLogger = ({ worker }: initWorkerEventsLoggerProps) => {
  const logger = createLogger({ name: "bullmq" });

  // Start the time
  let startTime = Date.now();

  worker.on("active", (job: Job) => {
    startTime = Date.now();

    logger.debug(
      { name: "job", jobName: job.name, jobId: job.id },
      `Job #${job.id} started.`
    );
  });

  worker.on("completed", (job: Job) => {
    // Calculate elapsed time
    const elapsedSeconds = (Date.now() - startTime) / 1000;
    const used = process.memoryUsage().heapUsed / 1024 / 1024;
    const memoryUsedInMB = Math.round(used * 100) / 100;

    // Write stats like elapsed time and memory used for this job to the logs
    logger.debug(
      {
        name: "job",
        jobName: job.name,
        jobId: job.id,
        elapsedTime: `${elapsedSeconds} seconds`,
        memoryUsed: `${memoryUsedInMB} MB`,
      },
      `Job #${job.id} completed.`
    );
  });

  worker.on("failed", (job: Job) => {
    logger.error(
      {
        name: "job",
        jobName: job.name,
        jobId: job.id,
        error: job.failedReason,
      },
      `Job #${job.id} failed.`
    );
  });
};

export const bullmqService = { initWorkerEventsLogger };
