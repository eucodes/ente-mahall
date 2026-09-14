import { DisabilityType, HealthConditionStatus, SupportStatus } from "@mahalle/database";
import { Type } from "class-transformer";
import { IsArray, IsBoolean, IsDateString, IsEnum, IsInt, IsOptional, IsString, Max, MaxLength, Min } from "class-validator";

export class MemberHealthProfileDto {
  @IsOptional()
  @IsEnum(HealthConditionStatus)
  status?: HealthConditionStatus;

  // Disability
  @IsOptional()
  @IsBoolean()
  hasDisability?: boolean;

  @IsOptional()
  @IsEnum(DisabilityType)
  disabilityType?: DisabilityType;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  @Type(() => Number)
  disabilityPercentage?: number;

  @IsOptional()
  @IsBoolean()
  disabilityCertificate?: boolean;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  disabilityCertificateNo?: string;

  // Chronic Illness
  @IsOptional()
  @IsBoolean()
  hasChronicIllness?: boolean;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  chronicConditions?: string[];

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  chronicDetails?: string;

  @IsOptional()
  @IsBoolean()
  treatmentRequired?: boolean;

  @IsOptional()
  @IsBoolean()
  regularMedicationRequired?: boolean;

  // Mental Health & Sensitive Support
  @IsOptional()
  @IsBoolean()
  requiresMentalHealthSupport?: boolean;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  mentalHealthSupportType?: string;

  // Care & Assistance
  @IsOptional()
  @IsBoolean()
  requiresAssistance?: boolean;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  assistanceTypes?: string[];

  @IsOptional()
  @IsString()
  @MaxLength(255)
  primaryCaregiverName?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  caregiverRelationship?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  emergencyContactName?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  emergencyContactPhone?: string;

  // Mahallu Community Support
  @IsOptional()
  @IsBoolean()
  requiresCommunitySupport?: boolean;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  supportCategory?: string;

  @IsOptional()
  @IsEnum(SupportStatus)
  supportStatus?: SupportStatus;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  supportNotes?: string;

  @IsOptional()
  @IsDateString()
  lastSupportDate?: string;
}
