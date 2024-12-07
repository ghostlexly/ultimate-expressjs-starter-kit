import { Router } from "express";
import { sessionsGuard } from "./../../common/guards/sessions.guard";
import { meController } from "./me.controller";

export const meRoutes = Router();

/**
 * @swagger
 * /api/me:
 *  get:
 *    summary: Get the current logged-in user's information.
 *    description: Get the current logged-in user's information.
 *    tags: [Me]
 *    security:
 *      - bearerAuth: []
 *    responses:
 *      '200':
 *        description: OK
 */
meRoutes.get("/me", sessionsGuard, meController.getMe);
