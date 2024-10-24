import { Router } from "express";
import { mediaController } from "./controllers/media.controller";
import multer from "multer";

export const mediaRouter = Router();

const fileInterceptor = multer({
  storage: multer.diskStorage({}),
  limits: {
    files: 1,
  },
});

/**
 * @swagger
 * /api/media:
 *  post:
 *    tags: [Media]
 *    summary: Upload a media
 *    description: Upload a media to the server.
 *    requestBody:
 *      required: true
 *      content:
 *        multipart/form-data:
 *          schema:
 *            type: object
 *            properties:
 *              file:
 *                type: string
 *                format: binary
 *    responses:
 *      '200':
 *        description: OK
 */
mediaRouter.post("/", fileInterceptor.single("file"), mediaController.create);

/**
 * @swagger
 * /api/media/video:
 *  post:
 *    tags: [Media]
 *    summary: Upload a video media
 *    description: Upload a video media to the server.
 *    requestBody:
 *      required: true
 *      content:
 *        multipart/form-data:
 *          schema:
 *            type: object
 *            properties:
 *              file:
 *                type: string
 *                format: binary
 *    responses:
 *      '200':
 *        description: OK
 */
mediaRouter.post(
  "/video",
  fileInterceptor.single("file"),
  mediaController.createVideo
);
