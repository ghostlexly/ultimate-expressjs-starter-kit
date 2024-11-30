import { z } from "zod";

export const adminAuthLoginSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(8),
  }),
});

export type AdminAuthLoginSchema = z.infer<typeof adminAuthLoginSchema>;
