import { REDIS_CONNECTION } from "@/common/providers/cache/redis";
import { bullmqService } from "@/common/providers/queue/bullmq";
import { Queue, Worker } from "bullmq";
import path from "path";

// -- Queue
const testingQueue = new Queue("testing", {
  connection: REDIS_CONNECTION,
});

// -- Worker
const testingWorker = new Worker(
  "testing", // queue name
  path.join(__dirname, "testing.worker.js"),
  {
    connection: REDIS_CONNECTION,
    removeOnComplete: { count: 10 },
  }
);

// -- Worker Events
bullmqService.initWorkerEventsLogger({
  worker: testingWorker,
});

export { testingQueue };
