import { z } from "zod";

export const adminAuthLoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});