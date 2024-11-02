import { transformPhoneNumber } from "@/common/transformers/phone-number.transformer";
import { phoneNumberSchema } from "@/common/validators/phone-number.schema";
import { z } from "zod";

export const accountUpdateSchema = z.object({
  name: z.string(),
  bookings: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
    })
  ),
  phoneNumber: z.string().pipe(phoneNumberSchema).pipe(transformPhoneNumber),
});
