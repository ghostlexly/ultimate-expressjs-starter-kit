import { eventEmitter } from "@/common/lib/event-emitter";
import { loggerService } from "@/common/lib/logger";

const logger = loggerService.create({ name: "test-event-listener" });

eventEmitter.on("test.event", async (data) => {
  logger.info({ data }, "test-event listener received data !");
});
