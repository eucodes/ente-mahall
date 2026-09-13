import { IsDateString, IsNumberString, IsOptional, IsString, MaxLength, MinLength } from "class-validator";

export class CreateInterestFreeAccountDto {
  @IsOptional() @IsString() @MaxLength(50) accountNumber?: string;
  @IsString() @MinLength(1) @MaxLength(255) holderName!: string;
  @IsOptional() @IsString() @MaxLength(50) holderType?: string; // MEMBER, FAMILY, OTHER
  @IsOptional() @IsString() memberId?: string;
  @IsOptional() @IsString() familyId?: string;
  @IsOptional() @IsString() @MaxLength(50) phone?: string;
  @IsOptional() @IsNumberString() openingBalance?: string;
}

export class CreateInterestFreeTransactionDto {
  @IsString() accountId!: string;
  @IsString() type!: string; // DEPOSIT, WITHDRAWAL, TRANSFER
  @IsNumberString() amount!: string;
  @IsOptional() @IsDateString() date?: string;
  @IsOptional() @IsString() @MaxLength(255) reference?: string;
  @IsOptional() @IsString() @MaxLength(1000) description?: string;
}
