import { z } from "zod";
import { phoneUtils } from "../utils/phone-utils";

export const phoneNumberValidator = z.string().refine((value) => {
  return phoneUtils.isValid({ phoneNumber: value });
}, "This phone number is invalid.");
