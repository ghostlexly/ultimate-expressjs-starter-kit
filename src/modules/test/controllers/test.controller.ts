import { validate } from "@/common/lib/validator";
import { NextFunction, Request, Response } from "express";
import { AccountDto } from "../dtos/account.dto";
import { testingQueue } from "../queues/testing/testing.queue";
import { accountUpdateSchema } from "../schemas/account-update.schema";
import { TESTING_JOB } from "../queues/testing/testing.job";
import { services } from "@/common/lib/services";
import { HttpError } from "@/common/lib/errors";
import { testConfig } from "../test.config";
import { serializerService } from "@/common/services/serializer.service";
import { eventsService } from "@/common/services/events.service";

const testBadRequest = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    throw HttpError.BadRequest({
      body: "An error occurred.",
      code: "TEST_BAD_REQUEST",
    });

    // throw new HttpError({
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

const testQueueLaunch = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
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

const testZod = async (req: Request, res: Response, next: NextFunction) => {
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

const testSerializer = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
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

const testEventEmitter = async (
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

const testDependencyInjection = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = services.testService.example();

    return res.json({
      message: result,
      commissionRate: testConfig.defaultCommissionRate,
    });
  } catch (error) {
    next(error);
  }
};

export const testController = {
  testBadRequest,
  testQueueLaunch,
  testZod,
  testSerializer,
  testEventEmitter,
  testDependencyInjection,
};
