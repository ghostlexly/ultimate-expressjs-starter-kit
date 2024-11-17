import { strictThrottler } from "@/common/throttlers/strict.throttler";
import { Router } from "express";
import { SessionService } from "../session.service";
import { CustomerAuthController } from "./customer-auth.controller";

export const customerAuthRouter = Router();
const sessionService = new SessionService();
const customerAuthController = new CustomerAuthController(sessionService);

/**
 * @swagger
 * /api/customer/auth/signin:
 *  post:
 *    tags: [Auth/Customer]
 *    summary: Signin to the customer panel
 *    description: Signin to the customer panel.
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              email:
 *                type: string
 *              password:
 *                type: string
 *    responses:
 *      '200':
 *        description: OK
 */
customerAuthRouter.post(
  "/customer/auth/signin",
  strictThrottler,
  customerAuthController.signin
);
