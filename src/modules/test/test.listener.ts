import { createLogger } from "#/shared/utils/logger";
import { eventsService } from "#/infrastructure/events/events.service";

const logger = createLogger({ name: "test-event-listener" });

eventsService.on("test.event", async (data) => {
  logger.info({ data }, "test-event listener received data !");
});
