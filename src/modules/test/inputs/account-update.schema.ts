import { phoneNumberTransformer } from "./../../../common/transformers/phone-number.transformer";
import { phoneNumberValidator } from "./../../../common/validators/phone-number.validator";
import { z } from "zod";

export const accountUpdateSchema = z.object({
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

export type AccountUpdateSchema = z.infer<typeof accountUpdateSchema>;
