class WriteTextUseCase {
  execute = () => {
    // Add very complex business logic here.
    // You can call services, repositories, etc. from multiple modules.
    return "Hello World";
  };
}

export const writeTextUseCase = new WriteTextUseCase();
