import { ClassTransformOptions, plainToInstance } from "class-transformer";

const serialize = ({
  dto,
  data,
  options,
}: {
  dto: any;
  data: any;
  options?: ClassTransformOptions;
}) => {
  return plainToInstance(dto, data, {
    excludeExtraneousValues: true,
    ...options,
  });
};

export const serializerService = { serialize };
