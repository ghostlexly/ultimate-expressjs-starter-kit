import { Expose, Type } from "class-transformer";

class ExtraDataDto {
  @Expose()
  id: string;

  @Expose()
  name: string;
}

export class AccountDto {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  @Type(() => ExtraDataDto)
  extraData: ExtraDataDto;
}
