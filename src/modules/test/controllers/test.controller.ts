import { NextFunction, Request, Response } from "express";
import { TESTING_JOB } from "../../../infrastructure/queue/bull/jobs/testing.job";
import { testConfig } from "../test.config";
import fs from "fs/promises";
import path from "path";
import ejs from "ejs";
import { testService } from "../test.service";
import { HttpException } from "#/shared/exceptions/http-exception";
import { appQueue } from "#/infrastructure/queue/bull/app.queue";
import { AccountUpdateValidator } from "../validators/account-update.validator";
import { eventsService } from "#/infrastructure/events/events.service";
import { getAppDir } from "#/shared/utils/app-dir";
import { pdfService } from "#/shared/services/pdf.service";
import { testWriteTextUseCase } from "#/core/use-cases/test-write-text.usecase";
import { toAccountDto } from "../dtos/account.dto";

export class TestController {
  onTestBadRequest = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      throw HttpException.badRequest({
        message: "An error occurred.",
        code: "TEST_BAD_REQUEST",
      });

      // throw new HttpException({
      //   status: 400,
      //   body: "An error occurred.",
      //   code: "TEST_BAD_REQUEST",
      // });
    } catch (error) {
      next(error);
    }
  };

  onTestQueueLaunch = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      await appQueue.add(TESTING_JOB, {
        message: "Hello World",
      });

      return res.json({
        message: "Job added to queue.",
      });
    } catch (error) {
      next(error);
    }
  };

  onTestZod = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const body = req.body as AccountUpdateValidator["body"];

      return res.json(body);
    } catch (error) {
      next(error);
    }
  };

  onTestDto = async (req: Request, res: Response, next: NextFunction) => {
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

      const accountDto = toAccountDto(data);

      return res.json(accountDto);
    } catch (error) {
      next(error);
    }
  };

  onTestEventEmitter = async (
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

  onTestDependencyInjection = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const result = testService.example();

      return res.json({
        message: result,
        commissionRate: testConfig.defaultCommissionRate,
      });
    } catch (error) {
      next(error);
    }
  };

  onTestPdf = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Get template
      const template = await fs.readFile(
        path.join(getAppDir(), "shared", "views", "invoice.ejs"),
        "utf-8"
      );

      // Render template
      const renderedTemplate = ejs.render(template, {});

      // Generate PDF
      const pdfBuffer = await pdfService.htmlToPdf({ html: renderedTemplate });

      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", "inline; filename=invoice.pdf");
      return res.send(pdfBuffer);
    } catch (error) {
      next(error);
    }
  };

  onTestComplexUseCase = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const result = testWriteTextUseCase.execute();

      return res.json({
        message: result,
      });
    } catch (error) {
      next(error);
    }
  };
}

export const testController = new TestController();
