import { IsBoolean, IsEnum, IsInt, IsOptional, IsPositive, IsString, MaxLength, Min } from "class-validator";
import { BillingPeriod } from "@mahalle/types";

export class UpdatePlanDto {
  @IsOptional()
  @IsString()
  @MaxLength(200)
  name?: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  description?: string;

  @IsOptional()
  @IsInt()
  @IsPositive()
  priceMinor?: number;

  @IsOptional()
  @IsEnum(BillingPeriod)
  billingPeriod?: BillingPeriod;

  @IsOptional()
  @IsInt()
  @Min(0)
  userLimit?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  memberLimit?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  storageLimitMb?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  smsCredits?: number;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  supportLevel?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
