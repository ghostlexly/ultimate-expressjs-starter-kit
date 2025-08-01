import { z } from "zod";

export const emptyStringToNullTransformer = z
  .string()
  .transform((v) => (v === "" ? null : v));
