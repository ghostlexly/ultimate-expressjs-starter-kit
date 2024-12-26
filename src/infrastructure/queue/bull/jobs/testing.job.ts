import { SandboxedJob } from "bullmq";
import { createLogger } from "#/shared/utils/logger";
import { prisma } from "#/infrastructure/database/prisma";

export const TESTING_JOB = "testingJob";

export const testingJob = async (job: SandboxedJob) => {
  const logger = createLogger({ name: "testingJob" });

  const { message } = job.data;

  logger.info(`Received message: ${message}`);
  logger.info("Hello World from testing job");

  // try prisma
  const accounts = await prisma.account.findMany({});
  logger.debug({
    name: "testingWorker", // optional
    msg: "Accounts list received",
    accounts,
  });
};
