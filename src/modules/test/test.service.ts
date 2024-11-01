import { TServiceContainer } from "@/common/lib/services";

export const createTestService = ({
  testAuthorService,
}: {
  testAuthorService: TServiceContainer["testAuthorService"];
}) => {
  /**
   * Example of a service that uses another service from another module (Dependency Injection)
   */
  const example = () => {
    const result = testAuthorService.sayHello();
    return `message received from another module's injected service: ${result}`;
  };

  return {
    example,
  };
};
