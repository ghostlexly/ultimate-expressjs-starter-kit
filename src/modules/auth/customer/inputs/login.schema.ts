import { z } from "zod";

export const customerAuthLoginSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(8),
  }),
});

export type CustomerAuthLoginSchema = z.infer<typeof customerAuthLoginSchema>;
