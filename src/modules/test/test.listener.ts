import { createLogger } from "./../../common/lib/logger";
import { eventsService } from "./../../common/services/events.service";

const logger = createLogger({ name: "test-event-listener" });

eventsService.on("test.event", async (data) => {
  logger.info({ data }, "test-event listener received data !");
});
