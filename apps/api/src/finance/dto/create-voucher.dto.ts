import { VoucherType } from "@mahalle/database";
import { Transform } from "class-transformer";
import { IsDateString, IsEnum, IsNumberString, IsOptional, IsString, MaxLength } from "class-validator";

export class CreateVoucherDto {
  @IsEnum(VoucherType) type!: VoucherType;
  @IsOptional() @IsString() @MaxLength(50) voucherSubtype?: string; // EXPENSE, PAYMENT, GENERAL, RECEIPT
  @IsOptional() @IsString() @MaxLength(50) status?: string; // DRAFT, SUBMITTED, APPROVED, PAID, CANCELLED
  @IsString() accountId!: string;
  @IsOptional() @IsString() memberId?: string;
  @IsOptional() @IsString() eventId?: string;
  @IsOptional() @IsString() expenseCategoryId?: string;
  @IsOptional() @IsString() bankAccountId?: string;
  @IsDateString() date!: string;
  @Transform(({ value }) => (value != null ? String(value) : value))
  @IsNumberString() amount!: string;
  @IsOptional() @IsString() @MaxLength(255) partyName?: string;
  @IsOptional() @IsString() @MaxLength(255) payeeName?: string;
  @IsOptional() @IsString() @MaxLength(100) paymentMethod?: string;
  @IsOptional() @IsString() @MaxLength(255) reference?: string;
  @IsOptional() @IsString() @MaxLength(1000) description?: string;
  @IsOptional() @IsString() @MaxLength(1000) attachmentUrl?: string;
  @IsOptional() @IsString() @MaxLength(1000) notes?: string;
}
