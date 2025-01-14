import { strictThrottler } from "#/presentation/throttlers/strict.throttler";
import { Router } from "express";
import { adminAuthController } from "../controllers/admin-auth.controller";

export const adminAuthRoutes = Router();

/**
 * @swagger
 * /api/admin/auth/signin:
 *  post:
 *    summary: Signin to the admin panel
 *    description: Signin to the admin panel.
 *    tags: [Auth/Admin]
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
adminAuthRoutes.post(
  "/admin/auth/signin",
  strictThrottler,
  adminAuthController.onSignin
);
