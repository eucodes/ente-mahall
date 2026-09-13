import { IsInt, IsOptional, IsString, Max, MaxLength, Min } from "class-validator";

export class UpdateFinanceSettingsDto {
  @IsOptional() @IsString() @MaxLength(10) currency?: string;
  @IsOptional() @IsInt() @Min(1) @Max(12) financialYearStartMonth?: number;
  @IsOptional() @IsInt() @Min(1) @Max(31) financialYearStartDay?: number;
  @IsOptional() @IsString() @MaxLength(500) defaultCollectionDescription?: string | null;
  @IsOptional() @IsString() defaultPaymentMethodId?: string | null;
  @IsOptional() @IsString() defaultCashAccountId?: string | null;
  @IsOptional() @IsString() defaultBankAccountId?: string | null;
  @IsOptional() @IsString() @MaxLength(20) receiptPrefix?: string;
  @IsOptional() @IsInt() @Min(1) receiptStartNumber?: number;
  @IsOptional() @IsInt() @Min(3) @Max(10) receiptDigits?: number;
  @IsOptional() @IsString() @MaxLength(20) voucherPrefix?: string;
  @IsOptional() @IsInt() @Min(1) voucherStartNumber?: number;
  @IsOptional() @IsInt() @Min(3) @Max(10) voucherDigits?: number;
  @IsOptional() @IsString() defaultSalaryExpenseAccountId?: string | null;
  @IsOptional() @IsString() defaultCollectionIncomeAccountId?: string | null;
  @IsOptional() @IsString() defaultDonationIncomeAccountId?: string | null;
  @IsOptional() @IsString() defaultGeneralExpenseAccountId?: string | null;
}
