import { Role } from "@/generated/prisma/client";
import { z } from "zod";

export const authSigninValidator = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(1),
    role: z.nativeEnum(Role),
  }),
});

export const authRefreshTokenValidator = z.object({
  body: z.object({
    refreshToken: z.string().min(1).optional(),
  }),
});
