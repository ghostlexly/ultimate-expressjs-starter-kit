import { strictThrottler } from "#/presentation/throttlers/strict.throttler";
import { Router } from "express";
import { customerAuthController } from "../controllers/customer-auth.controller";

export const customerAuthRoutes = Router();

/**
 * @swagger
 * /api/customer/auth/signin:
 *  post:
 *    summary: Signin to the customer panel
 *    description: Signin to the customer panel.
 *    tags: [Auth/Customer]
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
customerAuthRoutes.post(
  "/customer/auth/signin",
  strictThrottler,
  customerAuthController.onSignin
);
