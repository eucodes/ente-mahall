import { SupportStatus } from "@mahalle/database";
import { IsBoolean, IsEnum, IsOptional, IsString, MaxLength, MinLength } from "class-validator";

export class CreateFamilyDto {
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  name!: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  address?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  phone?: string;

  @IsOptional()
  @IsString()
  houseId?: string;

  @IsOptional()
  @IsString()
  familyStatusId?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  category?: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  notes?: string;

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
  @IsString()
  @MaxLength(255)
  emergencyContactName?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  emergencyContactPhone?: string;
}

