import { loggerService } from "@/common/lib/logger";
import { prisma } from "@/common/providers/database/prisma";
import { SandboxedJob } from "bullmq";

export const TESTING_JOB = "testingJob";

export const testingJob = async (job: SandboxedJob) => {
  const logger = loggerService.create({ name: "testingJob" });

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
