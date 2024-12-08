import { REDIS_CONNECTION } from "#/common/providers/cache/redis";
import { bullmqService } from "#/common/providers/queue/bullmq";
import { Queue, Worker } from "bullmq";
import path from "path";

// -- Queue
const testQueue = new Queue("test", {
  connection: REDIS_CONNECTION,
});

// -- Worker
const testWorker = new Worker(
  "test", // queue name
  path.join(__dirname, "test.worker.js"),
  {
    connection: REDIS_CONNECTION,
    removeOnComplete: { count: 10 },
  }
);

// -- Worker Events
bullmqService.initWorkerEventsLogger({
  worker: testWorker,
});

export { testQueue };
