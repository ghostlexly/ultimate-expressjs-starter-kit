import { z } from "zod";

export const adminAuthLoginValidator = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(8),
  }),
});

export type AdminAuthLoginValidator = z.infer<typeof adminAuthLoginValidator>;
