import { IsEnum } from "class-validator";
import { SubscriptionStatus } from "@mahalle/types";

export class UpdateSubscriptionStatusDto {
  @IsEnum(SubscriptionStatus)
  status!: SubscriptionStatus;
}
