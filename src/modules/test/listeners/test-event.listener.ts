import { eventEmitter } from "@/common/lib/event-emitter";
import { createLogger } from "@/common/lib/logger";

const logger = createLogger({ name: "test-event-listener" });

eventEmitter.on("test.event", async (data) => {
  logger.info({ data }, "test-event listener received data !");
});
