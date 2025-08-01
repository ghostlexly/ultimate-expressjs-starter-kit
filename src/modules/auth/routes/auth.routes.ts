import { strictThrottler } from "@/common/throttlers/strict.throttler";
import { Router } from "express";
import { authController } from "../controllers/auth.controller";

export const authRoutes = Router();

/**
 * @summary: Sign in
 * @description: Sign in as admin or customer
 */
authRoutes.post("/auth/signin", strictThrottler, authController.signIn);

/**
 * @summary: Refresh token
 * @description: Generate a new access token from a refresh token
 */
authRoutes.post("/auth/refresh", authController.refreshToken);
