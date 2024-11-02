import { z } from "zod";

export const transformEmptyStringToNull = z
  .string()
  .transform((v) => (v === "" ? null : v));
