import { EventEmitter2 } from "eventemitter2";
import { createLogger } from "#/shared/utils/logger";
import path from "path";
import { getAppDir } from "#/shared/utils/app-dir";
import { glob } from "glob";
import { configService } from "#/shared/services/config.service";

const logger = createLogger({ name: "initializeEventEmitter" });

export type AppEvents = {
  "test.event": (data: string) => void;
  "cart.updated": (data: { cartId: string }) => void;
  "payment.updated": (data: { payment: any }) => void;
  "payment.created": (data: { payment: any }) => void;
  "booking.created": (data: { bookingId: string; cartId: string }) => void;
  "booking.updated": (data: { bookingId: string; cartId: string }) => void;
  "booking.deleted": (data: { bookingId: string; cartId: string }) => void;
  "booking.completed": (data: { bookingId: string; cartId: string }) => void;
};

const eventBus = new EventEmitter2({
  wildcard: true,
  delimiter: ".",
  maxListeners: 20,
});

const initializeEventEmitter = async () => {
  try {
    // -- get modules path
    const modulesPath = path.join(getAppDir(), "modules");

    // -- get all listeners files
    const files = await glob("**/*.listener.{ts,js}", {
      cwd: modulesPath,
    });

    // -- load all listeners
    await Promise.all(files.map((file) => loadListener(modulesPath, file)));
  } catch (error) {
    logger.error(error, "Failed to initialize EventEmitter !");
    throw error;
  }
};

const loadListener = async (
  modulesPath: string,
  file: string
): Promise<void> => {
  try {
    const filePath = path.join(modulesPath, file);
    await import(filePath);

    if (configService.getOrThrow("NODE_ENV") !== "test") {
      logger.info(`Loaded [${file}] events listener(s).`);
    }
  } catch (error) {
    logger.error(error, `Failed to load listener ${file} !`);
  }
};

// Type safety pour nos événements
export const emitEvent = <K extends keyof AppEvents>(
  event: K,
  data: Parameters<AppEvents[K]>[0]
): boolean => eventBus.emit(event, data);

export const emitEventAsync = <K extends keyof AppEvents>(
  event: K,
  data: Parameters<AppEvents[K]>[0]
): Promise<any[]> => {
  return eventBus.emitAsync(event, data);
};

export const onEvent = <K extends keyof AppEvents>(
  event: K,
  listener: AppEvents[K]
): void => {
  eventBus.on(event, listener);
};

export const offEvent = <K extends keyof AppEvents>(
  event: K,
  listener: AppEvents[K]
): void => {
  eventBus.off(event, listener);
};

/**
 * Global event service singleton.
 * Using singleton pattern as we want to ensure all events
 * are handled through a single, application-wide event bus.
 */
export const eventsService = {
  bus: eventBus,
  initialize: initializeEventEmitter,
  emit: emitEvent,
  emitAsync: emitEventAsync,
  on: onEvent,
  off: offEvent,
};
