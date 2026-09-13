import { IsEnum, IsInt, IsOptional, IsPositive, IsString, Matches, MaxLength, Min } from "class-validator";
import { BillingPeriod } from "@mahalle/types";

export class CreatePlanDto {
  @IsString()
  @MaxLength(100)
  @Matches(/^[a-z0-9-]+$/, { message: "key must be lowercase letters, numbers, and hyphens only" })
  key!: string;

  @IsString()
  @MaxLength(200)
  name!: string;

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
}
