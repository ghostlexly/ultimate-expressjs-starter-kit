import { eventEmitter } from "@/common/lib/event-emitter";
import { createLoggerService } from "@/common/lib/logger";

const logger = createLoggerService({ name: "test-event-listener" });

eventEmitter.on("test.event", async (data) => {
  logger.info({ data }, "test-event listener received data !");
});
