import { TestAuthorService } from "../test-author/test-author.service";

export class TestService {
  constructor(private readonly testAuthorService: TestAuthorService) {}

  /**
   * Example of a service that uses another service from another module (Dependency Injection)
   */
  example() {
    const result = this.testAuthorService.sayHello();
    return `message received from another module's injected service: ${result}`;
  }
}
