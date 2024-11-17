import { strictThrottler } from "@/common/throttlers/strict.throttler";
import { Router } from "express";
import { AdminAuthController } from "./admin-auth.controller";
import { SessionService } from "../session.service";

export const adminAuthRouter = Router();
const sessionService = new SessionService();
const adminAuthController = new AdminAuthController(sessionService);

/**
 * @swagger
 * /api/admin/auth/signin:
 *  post:
 *    tags: [Auth/Admin]
 *    summary: Signin to the admin panel
 *    description: Signin to the admin panel.
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
adminAuthRouter.post(
  "/admin/auth/signin",
  strictThrottler,
  adminAuthController.signin
);
