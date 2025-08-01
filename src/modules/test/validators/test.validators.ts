import { phoneNumberTransformer } from "@/common/transformers/phone-number.transformer";
import { phoneNumberValidator } from "@/common/validators/phone-number.validator";
import { z } from "zod";

export const updateAccountValidator = z.object({
  body: z.object({
    name: z.string().min(1),
    bookings: z.array(
      z.object({
        id: z.string().min(1),
        name: z.string().min(1),
      })
    ),
    phoneNumber: z
      .string()
      .pipe(phoneNumberValidator)
      .pipe(phoneNumberTransformer),
  }),
});
