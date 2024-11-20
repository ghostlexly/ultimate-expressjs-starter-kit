import { validate } from "@/common/lib/validator";
import { NextFunction, Request, Response } from "express";
import { customerAuthLoginSchema } from "./inputs/login.schema";
import { prisma } from "@/common/providers/database/prisma";
import * as bcrypt from "bcryptjs";
import { HttpException } from "@/common/errors/http-exception";
import { sessionService } from "../session.service";

export class CustomerAuthController {
  signin = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const body = await validate({
        data: req.body,
        schema: customerAuthLoginSchema,
      });

      // -- verify if user exists
      const user = await prisma.customer.findFirst({
        where: {
          email: body.email,
        },
      });

      if (!user) {
        throw new HttpException({
          status: 401,
          message: "Invalid credentials.",
        });
      }

      // -- check if the user has a password
      if (!user.password) {
        throw new HttpException({
          status: 401,
          message: "Invalid credentials.",
        });
      }

      // -- hash given password and compare it to the stored hash
      const validPassword = await bcrypt.compare(body.password, user.password);
      if (!validPassword) {
        throw new HttpException({
          status: 401,
          message: "Invalid credentials.",
        });
      }

      // -- generate session token
      const session = await sessionService.create({
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

export const customerAuthController = new CustomerAuthController();
