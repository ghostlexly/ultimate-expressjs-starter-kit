import { REDIS_CONNECTION } from "./../../../common/providers/cache/redis";
import { bullmqService } from "./../../../common/providers/queue/bullmq";
import { Queue, Worker } from "bullmq";
import path from "path";

// -- Queue
const mediaQueue = new Queue("media", {
  connection: REDIS_CONNECTION,
});

// -- Worker
const mediaWorker = new Worker(
  "media", // queue name
  path.join(__dirname, "media.worker.js"),
  {
    connection: REDIS_CONNECTION,
    removeOnComplete: { count: 10 },
  }
);

// -- Worker Events
bullmqService.initWorkerEventsLogger({
  worker: mediaWorker,
});

export { mediaQueue };
