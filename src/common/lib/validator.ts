import { ZodSchema, z } from "zod";
import { ValidationException } from "../errors/validation-exception";

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
      throw new ValidationException({
        message: error.errors[0].message,
        violations: error.errors.map((e) => ({
          code: e.code,
          message: e.message,
          path: e.path.join("."),
        })),
        cause: error,
      });
    }

    throw error;
  }
};
