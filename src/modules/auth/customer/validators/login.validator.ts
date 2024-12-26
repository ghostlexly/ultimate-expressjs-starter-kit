import { z } from "zod";

export const customerAuthLoginValidator = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(8),
  }),
});

export type CustomerAuthLoginValidator = z.infer<
  typeof customerAuthLoginValidator
>;
