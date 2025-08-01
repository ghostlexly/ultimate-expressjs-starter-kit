import { z } from "zod";
import { phoneUtils } from "@/common/utils/phone-utils";

export const phoneNumberValidator = z.string().refine((value) => {
  return phoneUtils.isValid({ phoneNumber: value });
}, "Le numéro de téléphone est invalide");
