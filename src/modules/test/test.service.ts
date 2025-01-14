import { testAuthorService } from "#/modules/test-author/test-author.service";

export class TestService {
  /**
   * Example of a service that uses another service from another module (Dependency Injection)
   */
  example = () => {
    const result = testAuthorService.sayHello();
    return `message received from another module's injected service: ${result}`;
  };
}

export const testService = new TestService();
