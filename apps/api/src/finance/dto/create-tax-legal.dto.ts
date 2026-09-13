import { Transform } from "class-transformer";
import { IsDateString, IsNumberString, IsOptional, IsString, MaxLength, MinLength } from "class-validator";

export class CreateTaxLegalFilingDto {
  @IsString() @MinLength(1) @MaxLength(255) title!: string;
  @IsString() @MinLength(1) @MaxLength(50) filingType!: string; // WAKF_BOARD, TAX_RETURN, MUNICIPAL_TAX, AUDIT_REPORT, 12A_80G, OTHER
  @IsOptional() @IsString() @MaxLength(100) period?: string;
  @IsDateString() dueDate!: string;
  @IsOptional() @Transform(({ value }) => (value != null ? String(value) : value)) @IsNumberString() amount?: string;
  @IsOptional() @IsString() @MaxLength(50) status?: string; // PENDING, FILED, PAID, OVERDUE
  @IsOptional() @IsDateString() paymentDate?: string;
  @IsOptional() @IsString() @MaxLength(255) reference?: string;
  @IsOptional() @IsString() @MaxLength(1000) notes?: string;
  @IsOptional() @IsString() @MaxLength(1000) documentUrl?: string;
}

export class UpdateTaxLegalFilingDto {
  @IsOptional() @IsString() @MinLength(1) @MaxLength(255) title?: string;
  @IsOptional() @IsString() @MaxLength(50) filingType?: string;
  @IsOptional() @IsString() @MaxLength(100) period?: string;
  @IsOptional() @IsDateString() dueDate?: string;
  @IsOptional() @Transform(({ value }) => (value != null ? String(value) : value)) @IsNumberString() amount?: string;
  @IsOptional() @IsString() @MaxLength(50) status?: string;
  @IsOptional() @IsDateString() paymentDate?: string;
  @IsOptional() @IsString() @MaxLength(255) reference?: string;
  @IsOptional() @IsString() @MaxLength(1000) notes?: string;
  @IsOptional() @IsString() @MaxLength(1000) documentUrl?: string;
}
