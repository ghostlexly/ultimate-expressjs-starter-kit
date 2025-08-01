import { SandboxedJob } from "bullmq";
import { Logger } from "@/common/utils/logger";
import { prisma } from "@/common/database/prisma";

export const testingJob = async (job: SandboxedJob) => {
  const logger = new Logger("testingJob");

  const { message } = job.data;

  logger.info(`Received message: ${message}`);
  logger.info("Hello World from testing job");

  // try prisma
  const accounts = await prisma.account.findMany({});
  logger.debug("Accounts list received", {
    name: "testingWorker", // optional
    accounts,
  });

  // Can throw an error
  // throw new Error("Testing error");
};
