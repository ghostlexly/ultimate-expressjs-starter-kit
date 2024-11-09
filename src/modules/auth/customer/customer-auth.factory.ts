import { SessionService } from "../session.service";
import { CustomerAuthController } from "./customer-auth.controller";

export class CustomerAuthControllerFactory {
  private static instance: CustomerAuthController;

  static create() {
    if (!this.instance) {
      const sessionService = new SessionService();
      this.instance = new CustomerAuthController(sessionService);
    }
    return this.instance;
  }
}
