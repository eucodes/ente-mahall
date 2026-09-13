import { IsBoolean, IsNumberString, IsOptional, IsString, MaxLength, MinLength } from "class-validator";

export class CreateBankAccountDto {
  @IsString() @MinLength(1) @MaxLength(255) accountName!: string;
  @IsString() @MinLength(1) @MaxLength(255) bankName!: string;
  @IsOptional() @IsString() @MaxLength(255) branch?: string;
  @IsString() @MinLength(1) @MaxLength(100) accountNumber!: string;
  @IsOptional() @IsString() @MaxLength(50) ifsc?: string;
  @IsOptional() @IsString() @MaxLength(50) accountType?: string;
  @IsOptional() @IsNumberString() openingBalance?: string;
  @IsOptional() @IsString() chartAccountId?: string;
  @IsOptional() @IsBoolean() isActive?: boolean;
}

export class UpdateBankAccountDto {
  @IsOptional() @IsString() @MinLength(1) @MaxLength(255) accountName?: string;
  @IsOptional() @IsString() @MaxLength(255) bankName?: string;
  @IsOptional() @IsString() @MaxLength(255) branch?: string;
  @IsOptional() @IsString() @MaxLength(100) accountNumber?: string;
  @IsOptional() @IsString() @MaxLength(50) ifsc?: string;
  @IsOptional() @IsString() @MaxLength(50) accountType?: string;
  @IsOptional() @IsString() chartAccountId?: string | null;
  @IsOptional() @IsBoolean() isActive?: boolean;
}
