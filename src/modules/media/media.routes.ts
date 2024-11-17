import { Router } from "express";
import multer from "multer";
import { MediaController } from "./controllers/media.controller";
import { MediaService } from "./media.service";

export const mediaRouter = Router();

const mediaService = new MediaService();
const mediaController = new MediaController(mediaService);

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
mediaRouter.post(
  "/media",
  fileInterceptor.single("file"),
  mediaController.create
);

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
  "/media/video",
  fileInterceptor.single("file"),
  mediaController.createVideo
);
