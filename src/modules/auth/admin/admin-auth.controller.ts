import { validate } from "@/common/lib/validator";
import { NextFunction, Request, Response } from "express";
import { adminAuthLoginSchema } from "./inputs/login.schema";
import { prisma } from "@/common/providers/database/prisma";
import * as bcrypt from "bcryptjs";
import { HttpException } from "@/common/lib/errors";
import { SessionService } from "../session.service";

export class AdminAuthController {
  constructor(private readonly sessionService: SessionService) {}

  signin = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const body = await validate({
        data: req.body,
        schema: adminAuthLoginSchema,
      });

      // -- verify if user exists
      const user = await prisma.admin.findFirst({
        where: {
          email: body.email,
        },
      });

      if (!user) {
        throw new HttpException({
          status: 401,
          body: "Invalid credentials.",
        });
      }

      // -- hash given password and compare it to the stored hash
      const validPassword = await bcrypt.compare(body.password, user.password);
      if (!validPassword) {
        throw new HttpException({
          status: 401,
          body: "Invalid credentials.",
        });
      }

      // -- generate session token
      const session = await this.sessionService.create({
        accountId: user.accountId,
      });

      return res.json({
        access_token: session.token,
      });
    } catch (error) {
      next(error);
    }
  };
}
