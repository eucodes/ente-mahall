import { IsDateString, IsInt, IsOptional, IsPositive, IsString, MaxLength } from "class-validator";

export class CreateInvoiceDto {
  @IsInt()
  @IsPositive()
  amountMinor!: number;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @IsOptional()
  @IsDateString()
  dueAt?: string;
}
