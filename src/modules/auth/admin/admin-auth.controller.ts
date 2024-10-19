import { validate } from "@/src/common/lib/validator";
import { NextFunction, Request, Response } from "express";
import { adminAuthLoginSchema } from "./schemas/login.schema";
import { prisma } from "@/src/common/providers/database/prisma";
import createHttpError from "http-errors";
import * as bcrypt from "bcryptjs";
import { sessionService } from "../session.service";

const signin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { body } = await validate({ req, schema: adminAuthLoginSchema });

    // -- verify if user exists
    const user = await prisma.admin.findFirst({
      where: {
        email: body.email,
      },
    });

    if (!user) {
      throw createHttpError.Unauthorized("Invalid credentials.");
    }

    // -- hash given password and compare it to the stored hash
    const validPassword = await bcrypt.compare(body.password, user.password);
    if (!validPassword) {
      throw createHttpError.Unauthorized("Invalid credentials.");
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

export const adminAuthController = { signin };
