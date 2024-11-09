import { SessionService } from "../session.service";
import { AdminAuthController } from "./admin-auth.controller";

export class AdminAuthControllerFactory {
  private static instance: AdminAuthController;

  static create() {
    if (!this.instance) {
      const sessionService = new SessionService();
      this.instance = new AdminAuthController(sessionService);
    }
    return this.instance;
  }
}
