import { AnyZodObject, ZodEffects, ZodError } from "zod";
import { Request, Response, NextFunction } from "express";
import { ValidationException } from "#/shared/exceptions/validation-exception";

/**
 * Validates request query, params and body parameters
 * @param validator Zod validator that will be used to validate the request
 */
export const validateRequest =
  (zodSchema: AnyZodObject | ZodEffects<AnyZodObject>) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // -- We validate the request (body, query, params, file, files..)
      const validatedData = await zodSchema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
        file: req.file,
        files: req.files,
      });

      // -- Replace the request body with the validated data to remove any extra fields
      req.body = validatedData.body;

      // -- Validation was successful, continue
      return next();
    } catch (error) {
      if (error instanceof ZodError) {
        return next(
          new ValidationException({
            message: error.errors[0].message,
            violations: error.errors.map((e) => ({
              code: e.code,
              message: e.message,
              path: e.path.join("."),
            })),
            cause: error,
          })
        );
      }

      return next(error);
    }
  };
