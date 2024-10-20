import { REDIS_CONNECTION } from "@/common/providers/cache/redis";
import { bullmqService } from "@/common/providers/queue/bullmq";
import { Queue, Worker } from "bullmq";
import path from "path";

// -- Queue
const optimizeVideoQueue = new Queue("optimizeVideo", {
  connection: REDIS_CONNECTION,
});

// -- Worker
const optimizeVideoWorker = new Worker(
  "optimizeVideo", // queue name
  path.join(__dirname, "optimize-video.worker.js"),
  {
    connection: REDIS_CONNECTION,
    removeOnComplete: { count: 10 },
  }
);

// -- Worker Events
bullmqService.initWorkerEventsLogger({
  worker: optimizeVideoWorker,
});

export { optimizeVideoQueue };
