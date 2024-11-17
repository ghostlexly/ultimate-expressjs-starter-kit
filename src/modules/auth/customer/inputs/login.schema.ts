import { z } from "zod";

export const customerAuthLoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});
