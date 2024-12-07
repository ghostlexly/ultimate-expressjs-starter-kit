import { strictThrottler } from "./../../../common/throttlers/strict.throttler";
import { Router } from "express";
import { adminAuthController } from "./admin-auth.controller";
import { adminAuthLoginSchema } from "./inputs/login.schema";
import { validateRequest } from "./../../../common/middlewares/validation.middleware";

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
  validateRequest(adminAuthLoginSchema),
  strictThrottler,
  adminAuthController.signin
);
