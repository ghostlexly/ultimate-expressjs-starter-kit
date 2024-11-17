import { validate } from "@/common/lib/validator";
import { NextFunction, Request, Response } from "express";
import { AccountDto } from "../outputs/account.dto";
import { testingQueue } from "../queues/testing/testing.queue";
import { accountUpdateSchema } from "../inputs/account-update.schema";
import { TESTING_JOB } from "../queues/testing/testing.job";
import { HttpException } from "@/common/lib/errors";
import { testConfig } from "../test.config";
import { serializerService } from "@/common/services/serializer.service";
import { eventsService } from "@/common/services/events.service";
import { TestService } from "../test.service";

export class TestController {
  constructor(private readonly testService: TestService) {}

  testBadRequest = async (req: Request, res: Response, next: NextFunction) => {
    try {
      throw HttpException.BadRequest({
        body: "An error occurred.",
        code: "TEST_BAD_REQUEST",
      });

      // throw new HttpException({
      //   status: 400,
      //   body: "An error occurred.",
      //   code: "TEST_BAD_REQUEST",
      // });

      return res.json({
        message: "Hello World",
      });
    } catch (error) {
      next(error);
    }
  };

  testQueueLaunch = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await testingQueue.add(TESTING_JOB, {
        message: "Hello World",
      });

      return res.json({
        message: "Job added to queue.",
      });
    } catch (error) {
      next(error);
    }
  };

  testZod = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const body = await validate({
        data: req.body,
        schema: accountUpdateSchema,
      });

      return res.json(body);
    } catch (error) {
      next(error);
    }
  };

  testSerializer = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = {
        id: "123",
        name: "John Doe",
        thiswillalsoberemoved: "This will be removed too",
        extraData: {
          id: "456",
          name: "John Abc",
          thiswillberemoved: "This will be removed",
        },
      };

      const serialized = serializerService.serialize({
        dto: AccountDto,
        data,
      });

      return res.json(serialized);
    } catch (error) {
      next(error);
    }
  };

  testEventEmitter = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      await eventsService.emitAsync("test.event", "Hello World");

      return res.json({
        message: "Event emitted.",
      });
    } catch (error) {
      next(error);
    }
  };

  testDependencyInjection = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const result = this.testService.example();

      return res.json({
        message: result,
        commissionRate: testConfig.defaultCommissionRate,
      });
    } catch (error) {
      next(error);
    }
  };
}
