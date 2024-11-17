import { strictThrottler } from "@/common/throttlers/strict.throttler";
import { Router } from "express";
import { TestAuthorService } from "../test-author/test-author.service";
import { TestService } from "./test.service";
import { TestController } from "./controllers/test.controller";

export const testRouter = Router();

// -- Initialize services and controller
const testAuthorService = new TestAuthorService();
const testService = new TestService(testAuthorService);
const testController = new TestController(testService);

/**
 * @swagger
 * /api/tests/bad-request:
 *  get:
 *    tags: [Tests]
 *    summary: Test bad request
 *    description: Test a bad request error thrown from the server.
 *    responses:
 *      '200':
 *        description: OK
 */
testRouter.get("/tests/bad-request", testController.testBadRequest);

/**
 * @swagger
 * /api/tests/strict-throttler:
 *  get:
 *    tags: [Tests]
 *    summary: Test strict throttler
 *    description: Test a strict throttler that will block the IP Address after X attempts.
 *    responses:
 *      '200':
 *        description: OK
 */
testRouter.get(
  "/tests/strict-throttler",
  strictThrottler,
  testController.testSerializer
);

/**
 * @swagger
 * /api/tests/queue-launch:
 *  get:
 *    tags: [Tests]
 *    summary: Start a new queue
 *    description: Start a new sandboxed queue with BullMQ.
 *    responses:
 *      '200':
 *        description: OK
 */
testRouter.get("/tests/queue-launch", testController.testQueueLaunch);

/**
 * @swagger
 * /api/tests/zod:
 *  post:
 *    tags: [Tests]
 *    summary: Test Zod
 *    description: Test Zod validation.
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
testRouter.post("/tests/zod", testController.testZod);

/**
 * @swagger
 * /api/tests/serializer:
 *  get:
 *    tags: [Tests]
 *    summary: Test serializer
 *    description: Test serializer.
 *    responses:
 *      '200':
 *        description: OK
 */
testRouter.get("/tests/serializer", testController.testSerializer);

/**
 * @swagger
 * /api/tests/event-emitter:
 *  get:
 *    tags: [Tests]
 *    summary: Test event emitter
 *    description: Test event emitter.
 *    responses:
 *      '200':
 *        description: OK
 */
testRouter.get("/tests/event-emitter", testController.testEventEmitter);

/**
 * @swagger
 * /api/tests/dependency-injection:
 *  get:
 *    tags: [Tests]
 *    summary: Test dependency injection
 *    description: Inject a service from another module. This is a simple homemade dependency injection. Please check common/lib/services.ts for more details.
 *    responses:
 *      '200':
 *        description: OK
 */
testRouter.get(
  "/tests/dependency-injection",
  testController.testDependencyInjection
);
