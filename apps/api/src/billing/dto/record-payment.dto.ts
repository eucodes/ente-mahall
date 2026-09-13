import { IsInt, IsOptional, IsPositive, IsString, MaxLength } from "class-validator";

export class RecordPaymentDto {
  @IsInt()
  @IsPositive()
  amountMinor!: number;

  @IsString()
  @MaxLength(100)
  method!: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  reference?: string;

  @IsOptional()
  @IsString()
  invoiceId?: string;
}
