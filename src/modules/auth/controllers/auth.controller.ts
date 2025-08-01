import { NextFunction, Request, Response } from "express";
import { prisma } from "@/common/database/prisma";
import { HttpException } from "@/common/exceptions/http-exception";
import { Customer } from "@/generated/prisma/client";
import { Admin } from "@/generated/prisma/client";
import { authService } from "@/common/services/auth.service";
import { validateData } from "@/common/utils/validation";
import {
  authRefreshTokenValidator,
  authSigninValidator,
} from "../validators/auth.validator";
import { authConfig } from "../auth.config";

export class AuthController {
  signIn = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { body } = await validateData(authSigninValidator, {
        body: req.body,
      });

      // Verify if user exists
      let user: Admin | Customer | null = null;
      if (body.role === "ADMIN") {
        user = await prisma.admin.findFirst({
          where: {
            email: {
              contains: body.email,
              mode: "insensitive",
            },
          },
        });
      } else if (body.role === "CUSTOMER") {
        user = await prisma.customer.findFirst({
          where: {
            email: {
              contains: body.email,
              mode: "insensitive",
            },
          },
        });
      }

      if (!user) {
        throw HttpException.badRequest({
          message: "Mot de passe ou e-mail incorrect.",
        });
      }

      if (!user.password) {
        throw HttpException.badRequest({
          message:
            "You have previously signed up with another service like Google, please use the appropriate login method for this account.",
        });
      }

      // Hash given password and compare it to the stored hash
      const validPassword = await authService.comparePassword({
        password: body.password,
        hashedPassword: user.password,
      });

      if (!validPassword) {
        throw HttpException.badRequest({
          message: "Mot de passe ou e-mail incorrect.",
        });
      }

      // Generate an access token
      const { accessToken, refreshToken } =
        await authService.generateAuthenticationTokens({
          accountId: user.accountId,
        });

      res.cookie("lunisoft_access_token", accessToken, {
        secure: process.env.NODE_ENV === "production",
        maxAge: authConfig.accessTokenExpirationMinutes * 60 * 1000, // Convert minutes to milliseconds
      });

      res.cookie("lunisoft_refresh_token", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: authConfig.refreshTokenExpirationMinutes * 60 * 1000, // Convert minutes to milliseconds
      });

      return res.json({
        accessToken,
        refreshToken,
      });
    } catch (error) {
      next(error);
    }
  };

  refreshToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { body } = await validateData(authRefreshTokenValidator, {
        body: req.body,
      });

      let previousRefreshToken =
        body.refreshToken ?? req.cookies?.lunisoft_refresh_token;

      if (!previousRefreshToken) {
        throw HttpException.badRequest({
          message:
            "Refresh token not found. Please set it in the body parameter or in your cookies.",
        });
      }
      const { accessToken, refreshToken } = await authService
        .refreshAuthenticationTokens({
          refreshToken: previousRefreshToken,
        })
        .catch((error) => {
          throw HttpException.badRequest({
            message: error.message,
          });
        });

      res.cookie("lunisoft_access_token", accessToken, {
        secure: process.env.NODE_ENV === "production",
        maxAge: authConfig.accessTokenExpirationMinutes * 60 * 1000, // Convert minutes to milliseconds
      });

      res.cookie("lunisoft_refresh_token", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: authConfig.refreshTokenExpirationMinutes * 60 * 1000, // Convert minutes to milliseconds
      });

      return res.json({
        accessToken,
        refreshToken,
      });
    } catch (error) {
      next(error);
    }
  };
}

export const authController = new AuthController();
