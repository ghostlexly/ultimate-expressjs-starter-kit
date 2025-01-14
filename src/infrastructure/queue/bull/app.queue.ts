import { REDIS_CONNECTION } from "#/infrastructure/cache/redis/redis";
import { bullmqService } from "#/infrastructure/queue/bull/bullmq";
import { Queue, Worker } from "bullmq";
import path from "path";

// -- Queue
const appQueue = new Queue("app", {
  connection: REDIS_CONNECTION,
});

// -- Worker
const appWorker = new Worker(
  "app", // queue name
  path.join(__dirname, "app.worker.js"),
  {
    connection: REDIS_CONNECTION,
    removeOnComplete: { count: 10 },
  }
);

// -- Worker Events
bullmqService.initWorkerEventsLogger({
  worker: appWorker,
});

export { appQueue, appWorker };
