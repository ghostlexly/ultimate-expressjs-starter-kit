import { TestAuthorService } from "@/modules/test-author/test-author.service";
import { TestController } from "../controllers/test.controller";
import { TestService } from "../test.service";

/**
 * @description Factory for creating a TestController instance.
 * This pattern is the "Inversion of Control" principle, "Factory Pattern" and "Dependency Injection".
 */
export class TestControllerFactory {
  private static instance: TestController;

  static create() {
    if (!this.instance) {
      const testAuthorService = new TestAuthorService();
      const testService = new TestService(testAuthorService);
      this.instance = new TestController(testService);
    }
    return this.instance;
  }
}
