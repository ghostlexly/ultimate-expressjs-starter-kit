import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";

const getMe = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const account = req.account;

    if (account.role === "CUSTOMER") {
      return res.json({
        id: account.customer.id,
        email: account.customer.email,
        role: account.role,
      });
    } else if (account.role === "ADMIN") {
      return res.json({
        id: account.admin.id,
        email: account.admin.email,
        role: account.role,
      });
    } else {
      throw createHttpError.BadRequest("Invalid role.");
    }
  } catch (error) {
    next(error);
  }
};

export const meController = { getMe };
