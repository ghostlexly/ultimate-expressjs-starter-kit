import { ZodSchema, z } from "zod";
import { HttpError } from "./errors";

export const validate = async <T>({
  data,
  schema,
}: {
  data: any;
  schema: ZodSchema<T>;
}): Promise<T> => {
  try {
    return await schema.parseAsync(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new HttpError({
        status: 400,
        code: "VALIDATION_ERROR",
        body: {
          message: error.errors[0].message,
          violations: error.errors.map((e) => ({
            code: e.code,
            message: e.message,
            path: e.path.join("."),
          })),
        },
        cause: error,
      });
    }

    throw error;
  }
};
