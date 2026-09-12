import { AccountType } from "@mahalle/database";
import { IsEnum, IsString, MaxLength, MinLength } from "class-validator";

export class CreateAccountDto {
  @IsString() @MinLength(1) @MaxLength(255) name!: string;
  @IsEnum(AccountType) type!: AccountType;
}
