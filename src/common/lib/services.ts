import { createTestService } from "@/modules/test/test.service";
import { createLogger } from "./logger";
import { createTestAuthorService } from "@/modules/test-author/test-author.service";

const logger = createLogger({ name: "initializeServices" });

// Define a type for the service container
export type TServiceContainer = {
  testService: ReturnType<typeof createTestService>;
  testAuthorService: ReturnType<typeof createTestAuthorService>;
};

// Initialize the service container
const serviceContainer: Partial<TServiceContainer> = {};

/**
 * Initialize the services and register them in the service container.
 */
export const initializeServices = () => {
  // -- Create services
  const testAuthorService = createTestAuthorService();
  const testService = createTestService({ testAuthorService });

  // -- Register services
  serviceContainer.testService = testService;
  serviceContainer.testAuthorService = testAuthorService;

  // -- Log the number of services registered
  logger.info(
    `💉 ${
      Object.keys(serviceContainer).length
    } services registered in the container.`
  );
};

/**
 * Create a proxy to access services directly
 */
export const services: TServiceContainer = new Proxy(
  serviceContainer as TServiceContainer,
  {
    get(target, prop: keyof TServiceContainer) {
      const service = target[prop];
      if (!service) {
        throw new Error(`Service ${String(prop)} is not registered.`);
      }
      return service;
    },
  }
);
