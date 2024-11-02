import { z } from "zod";
import { phoneUtils } from "../lib/phone-utils";

export const phoneNumberSchema = z.string().refine((value) => {
  return phoneUtils.isValid({ phoneNumber: value });
}, "This phone number is invalid.");
