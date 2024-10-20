import { strictThrottler } from "@/common/throttlers/strict.throttler";
import { Router } from "express";
import { adminAuthController } from "./admin-auth.controller";

export const adminAuthRouter = Router();

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
