import { IsOptional, IsString } from "class-validator";

export class MarkSalaryPaidDto {
  @IsString() accountId!: string;
  @IsOptional() @IsString() paymentMethod?: string;
}
