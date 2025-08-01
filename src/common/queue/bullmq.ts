import { Job, Worker } from "bullmq";
import { Logger } from "@/common/utils/logger";

type initWorkerEventsLoggerProps = {
  worker: Worker;
};

const initWorkerEventsLogger = ({ worker }: initWorkerEventsLoggerProps) => {
  const logger = new Logger("bullmq");

  // Start the time
  let startTime = Date.now();

  worker.on("active", (job: Job) => {
    startTime = Date.now();

    logger.debug(`Job #${job.id} started.`, {
      name: "job",
      jobName: job.name,
      jobId: job.id,
    });
  });

  worker.on("completed", (job: Job) => {
    // Calculate elapsed time
    const elapsedSeconds = (Date.now() - startTime) / 1000;
    const used = process.memoryUsage().heapUsed / 1024 / 1024;
    const memoryUsedInMB = Math.round(used * 100) / 100;

    // Write stats like elapsed time and memory used for this job to the logs
    logger.debug(`Job #${job.id} completed.`, {
      name: "job",
      jobName: job.name,
      jobId: job.id,
      elapsedTime: `${elapsedSeconds} seconds`,
      memoryUsed: `${memoryUsedInMB} MB`,
    });
  });

  worker.on("failed", (job: Job) => {
    logger.error(`Job #${job.id} failed.`, {
      name: "job",
      jobName: job.name,
      jobId: job.id,
      error: job.failedReason,
    });
  });
};

export const bullmqService = { initWorkerEventsLogger };
