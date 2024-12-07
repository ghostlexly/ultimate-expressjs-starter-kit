import { z } from "zod";
import isIban from "validator/lib/isIBAN";

const ibanRegex = /^([A-Z]{2})(\d{2})([A-Z\d]{1,30})$/;

export const ibanValidator = z
  .string()
  .transform((v) => v.replace(/[ _]/g, "")) // Remove spaces and underscores
  .pipe(
    z.string().regex(ibanRegex, { message: "This IBAN number is incorrect." })
  )
  .pipe(
    z.string().refine((v) => isIban(v), {
      message:
        "This IBAN number does not match the country format or is invalid.",
    })
  );
