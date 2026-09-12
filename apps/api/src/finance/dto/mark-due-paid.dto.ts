import { IsOptional, IsString } from "class-validator";

export class MarkDuePaidDto {
  @IsString() accountId!: string;
  @IsOptional() @IsString() paymentMethod?: string;
}
