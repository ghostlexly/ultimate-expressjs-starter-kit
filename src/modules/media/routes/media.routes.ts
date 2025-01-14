import { Router } from "express";
import multer from "multer";
import { mediaController } from "../controllers/media.controller";

export const mediaRoutes = Router();

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
 *    summary: Upload a media
 *    description: Upload a media to the server.
 *    tags: [Media]
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
mediaRoutes.post(
  "/media",
  fileInterceptor.single("file"),
  mediaController.onUploadMedia
);

/**
 * @swagger
 * /api/media/video:
 *  post:
 *    summary: Upload a video media
 *    description: Upload a video media to the server.
 *    tags: [Media]
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
mediaRoutes.post(
  "/media/video",
  fileInterceptor.single("file"),
  mediaController.onUploadVideo
);
