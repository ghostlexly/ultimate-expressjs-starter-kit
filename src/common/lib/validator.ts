import { Request } from "express";
import createHttpError from "http-errors";
import { ZodSchema, z } from "zod";

type SchemaProps<TBody, TParams, TQuery> = {
  body?: ZodSchema<TBody>;
  params?: ZodSchema<TParams>;
  query?: ZodSchema<TQuery>;
};

type ValidateProps<TBody, TParams, TQuery> = {
  req: Request;
  schema: SchemaProps<TBody, TParams, TQuery>;
};

type ValidateResult<TBody, TParams, TQuery> = {
  body: TBody;
  params: TParams;
  query: TQuery;
};

const validate = async <TBody, TParams, TQuery>({
  req,
  schema,
}: ValidateProps<TBody, TParams, TQuery>): Promise<
  ValidateResult<TBody, TParams, TQuery>
> => {
  const output: Partial<ValidateResult<TBody, TParams, TQuery>> = {};

  const validatePart = async <T>(
    part: keyof ValidateResult<TBody, TParams, TQuery>,
    zodSchema?: ZodSchema<T>,
    data?: any
  ) => {
    if (zodSchema) {
      try {
        const parsedData = await zodSchema.parseAsync(data);
        output[part] = parsedData as (TBody & TParams & TQuery) | undefined;
      } catch (zodError) {
        if (zodError instanceof z.ZodError) {
          throw createHttpError(400, {
            message: `The form contains ${zodError.errors.length} error(s). Please correct them to continue.`,
            violations: zodError.errors.map((e) => ({
              type: part,
              code: e.code,
              message: e.message,
              path: e.path.join("."),
            })),
          });
        }
        throw zodError;
      }
    }
  };

  await validatePart("body", schema.body, req.body);
  await validatePart("params", schema.params, req.params);
  await validatePart("query", schema.query, req.query);

  return output as ValidateResult<TBody, TParams, TQuery>;
};

export { validate };
