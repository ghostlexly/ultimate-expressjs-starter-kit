import { z } from "zod";
import { phoneUtils } from "../lib/phone-utils";

export const phoneNumberTransformer = z
  .string()
  .transform((value) =>
    phoneUtils.parse({ phoneNumber: value }).formatInternational()
  );
