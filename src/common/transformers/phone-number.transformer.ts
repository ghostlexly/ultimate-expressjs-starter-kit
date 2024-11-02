import { z } from "zod";
import { phoneUtils } from "../lib/phone-utils";

export const transformPhoneNumber = z
  .string()
  .transform((value) =>
    phoneUtils.parse({ phoneNumber: value }).formatInternational()
  );
