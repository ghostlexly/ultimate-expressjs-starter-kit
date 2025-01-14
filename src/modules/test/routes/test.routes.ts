import { Router } from "express";
import { testController } from "../controllers/test.controller";
import { strictThrottler } from "#/presentation/throttlers/strict.throttler";
import { validateRequest } from "#/presentation/middlewares/validation.middleware";
import { accountUpdateValidator } from "../validators/account-update.validator";

export const testRoutes = Router();

/**
 * @swagger
 * /api/tests/bad-request:
 *  get:
 *    summary: Test bad request
 *    description: Test a bad request error thrown from the server.
 *    tags: [Tests]
 *    responses:
 *      '200':
 *        description: OK
 */
testRoutes.get("/tests/bad-request", testController.onTestBadRequest);

/**
 * @swagger
 * /api/tests/strict-throttler:
 *  get:
 *    summary: Test strict throttler
 *    description: Test a strict throttler that will block the IP Address after X attempts.
 *    tags: [Tests]
 *    responses:
 *      '200':
 *        description: OK
 */
testRoutes.get(
  "/tests/strict-throttler",
  strictThrottler,
  testController.onTestDto
);

/**
 * @swagger
 * /api/tests/queue-launch:
 *  get:
 *    summary: Start a new queue
 *    description: Start a new sandboxed queue with BullMQ.
 *    tags: [Tests]
 *    responses:
 *      '200':
 *        description: OK
 */
testRoutes.get("/tests/queue-launch", testController.onTestQueueLaunch);

/**
 * @swagger
 * /api/tests/zod:
 *  post:
 *    summary: Test Zod
 *    description: Test Zod validation.
 *    tags: [Tests]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              name:
 *                type: string
 *              bookings:
 *                type: array
 *                items:
 *                  type: object
 *                  properties:
 *                    id:
 *                      type: string
 *                    name:
 *                      type: string
 *              phoneNumber:
 *                type: string
 *    responses:
 *      '200':
 *        description: OK
 */
testRoutes.post(
  "/tests/zod",
  validateRequest(accountUpdateValidator),
  testController.onTestZod
);

/**
 * @swagger
 * /api/tests/dto:
 *  get:
 *    summary: Test DTO
 *    description: Test DTO.
 *    tags: [Tests]
 *    responses:
 *      '200':
 *        description: OK
 */
testRoutes.get("/tests/dto", testController.onTestDto);

/**
 * @swagger
 * /api/tests/event-emitter:
 *  get:
 *    summary: Test event emitter
 *    description: Test event emitter.
 *    tags: [Tests]
 *    responses:
 *      '200':
 *        description: OK
 */
testRoutes.get("/tests/event-emitter", testController.onTestEventEmitter);

/**
 * @swagger
 * /api/tests/dependency-injection:
 *  get:
 *    summary: Test dependency injection
 *    description: Inject a service from another module. This is a simple homemade dependency injection. Please check common/lib/services.ts for more details.
 *    tags: [Tests]
 *    responses:
 *      '200':
 *        description: OK
 */
testRoutes.get(
  "/tests/dependency-injection",
  testController.onTestDependencyInjection
);

/**
 * @swagger
 * /api/tests/pdf:
 *  get:
 *    summary: Test PDF
 *    description: Test PDF.
 *    tags: [Tests]
 *    responses:
 *      '200':
 *        description: OK
 */
testRoutes.get("/tests/pdf", testController.onTestPdf);

/**
 * @swagger
 * /api/tests/complex-use-case:
 *  get:
 *    summary: Test complex use case
 *    description: Test complex use case.
 *    tags: [Tests]
 *    responses:
 *      '200':
 *        description: OK
 */
testRoutes.get("/tests/complex-use-case", testController.onTestComplexUseCase);
