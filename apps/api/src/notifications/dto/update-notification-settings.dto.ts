import { IsBoolean, IsInt, IsOptional, IsString, Max, MaxLength, Min } from "class-validator";

export class UpdateNotificationSettingsDto {
  @IsOptional() @IsBoolean() notifyOnNewServiceRequest?: boolean;
  @IsOptional() @IsBoolean() notifyOnNewDue?: boolean;
  @IsOptional() @IsInt() @Min(0) @Max(30) eventReminderDaysBefore?: number;
  @IsOptional() @IsBoolean() smsEnabled?: boolean;
  @IsOptional() @IsString() @MaxLength(100) smsProviderName?: string;
  @IsOptional() @IsString() @MaxLength(20) smsSenderId?: string;
}
