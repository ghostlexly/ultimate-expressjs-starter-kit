import { createLogger } from "./logger";

type Constructor<T = any> = new (...args: any[]) => T;

export class Container {
  private logger = createLogger({ name: "container" });
  private services: Map<Constructor<any>, any>;
  private initialized = false;

  constructor() {
    this.services = new Map();
  }

  private initialize() {
    if (this.initialized) return;

    // Create all service instances with their dependencies
    // const testAuthorService = new TestAuthorService();
    // const testService = new TestService(testAuthorService);
    // ... other services

    // Register them
    // this.register(TestService, testService);

    this.initialized = true;
    this.logger.info("✅ Services registered successfully");
  }

  public register<T>(Service: Constructor<T>, instance: T): void {
    this.services.set(Service, instance);
  }

  public resolve<T>(Service: Constructor<T>): T {
    if (!this.initialized) {
      this.initialize();
    }

    const service = this.services.get(Service);
    if (!service) {
      throw new Error(`Service ${Service.name} not found in container`);
    }
    return service as T;
  }
}

export const container = new Container();
