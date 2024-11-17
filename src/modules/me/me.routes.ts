import { Router } from "express";
import { sessionsGuard } from "@/common/guards/sessions.guard";
import { MeController } from "./me.controller";

export const meRouter = Router();

const meController = new MeController();

/**
 * @swagger
 * /api/me:
 *  get:
 *    tags: [Me]
 *    summary: Get the current logged-in user's information.
 *    description: Get the current logged-in user's information.
 *    security:
 *      - bearerAuth: []
 *    responses:
 *      '200':
 *        description: OK
 */
meRouter.get("/me", sessionsGuard, meController.getMe);
