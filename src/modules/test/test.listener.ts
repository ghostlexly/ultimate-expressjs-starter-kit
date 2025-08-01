import { Logger } from "@/common/utils/logger";
import { eventsService } from "@/common/events/events.service";

const logger = new Logger("test-event-listener");

eventsService.on("test.event", async (data) => {
  logger.info("test-event listener received data !", { data });
});
