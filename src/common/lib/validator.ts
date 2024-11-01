import createHttpError from "http-errors";
import { ZodSchema, z } from "zod";

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
      throw createHttpError(400, {
        message: `The form contains ${error.errors.length} error(s). Please correct them to continue.`,
        violations: error.errors.map((e) => ({
          code: e.code,
          message: e.message,
          path: e.path.join("."),
        })),
      });
    }

    throw error;
  }
};
