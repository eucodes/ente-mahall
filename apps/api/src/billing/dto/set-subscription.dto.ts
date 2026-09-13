import { IsEnum, IsOptional, IsString } from "class-validator";
import { SubscriptionStatus } from "@mahalle/types";

export class SetSubscriptionDto {
  @IsString()
  planId!: string;

  @IsOptional()
  @IsEnum(SubscriptionStatus)
  status?: SubscriptionStatus;
}
