import { AccountType } from "@mahalle/database";
import { IsBoolean, IsEnum, IsNumberString, IsOptional, IsString, MaxLength, MinLength } from "class-validator";

export class CreateAccountDto {
  @IsString() @MinLength(1) @MaxLength(255) name!: string;
  @IsOptional() @IsString() @MaxLength(50) code?: string;
  @IsEnum(AccountType) type!: AccountType;
  @IsOptional() @IsString() parentAccountId?: string;
  @IsOptional() @IsString() @MaxLength(1000) description?: string;
  @IsOptional() @IsNumberString() openingBalance?: string;
  @IsOptional() @IsBoolean() isSystem?: boolean;
}
