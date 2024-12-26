import { phoneNumberTransformer } from "#/shared/transformers/phone-number.transformer";
import { phoneNumberValidator } from "#/shared/validators/phone-number.validator";
import { z } from "zod";

export const accountUpdateValidator = z.object({
  body: z.object({
    name: z.string(),
    bookings: z.array(
      z.object({
        id: z.string(),
        name: z.string(),
      })
    ),
    phoneNumber: z
      .string()
      .pipe(phoneNumberValidator)
      .pipe(phoneNumberTransformer),
  }),
});

export type AccountUpdateValidator = z.infer<typeof accountUpdateValidator>;
