import { IsBoolean, IsNumber, IsOptional, IsString } from "class-validator";

export class UpdatePlatformSettingsDto {
  @IsOptional()
  @IsString()
  platformName?: string;

  @IsOptional()
  @IsString()
  rootDomain?: string;

  @IsOptional()
  @IsString()
  supportEmail?: string;

  @IsOptional()
  @IsString()
  defaultCurrency?: string;

  @IsOptional()
  @IsString()
  timezone?: string;

  @IsOptional()
  @IsNumber()
  sessionTimeoutMinutes?: number;

  @IsOptional()
  @IsBoolean()
  require2FAForSuperadmins?: boolean;

  @IsOptional()
  @IsNumber()
  maxConcurrentSessions?: number;

  @IsOptional()
  @IsBoolean()
  autoApproveTenants?: boolean;

  @IsOptional()
  @IsNumber()
  defaultTrialDays?: number;

  @IsOptional()
  @IsNumber()
  auditRetentionDays?: number;
}
