import { BloodGroup, EducationLevel, EmploymentStatus, Gender, MaritalStatus, MovementStatus, RelationToHead } from "@mahalle/database";
import { Type } from "class-transformer";
import { IsArray, IsBoolean, IsDateString, IsEmail, IsEnum, IsOptional, IsString, MaxLength, MinLength, ValidateNested } from "class-validator";
import { MemberHealthProfileDto } from "./member-health-profile.dto";

export class CreateMemberDto {
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  fullName!: string;

  @IsOptional()
  @IsEmail()
  @MaxLength(255)
  email?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  phone?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  address?: string;

  @IsOptional()
  @IsString()
  familyId?: string;

  @IsOptional()
  @IsEnum(Gender)
  gender?: Gender;

  @IsOptional()
  @IsDateString()
  dateOfBirth?: string;

  @IsOptional()
  @IsEnum(MaritalStatus)
  maritalStatus?: MaritalStatus;

  @IsOptional()
  @IsEnum(BloodGroup)
  bloodGroup?: BloodGroup;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  occupation?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  idNumber?: string;

  @IsOptional()
  @IsEnum(RelationToHead)
  relationToHead?: RelationToHead;

  @IsOptional()
  @IsEnum(MovementStatus)
  movementStatus?: MovementStatus;

  @IsOptional()
  @IsDateString()
  movementDate?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  movementNotes?: string;

  @IsOptional()
  @IsBoolean()
  isYatheem?: boolean;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  guardianName?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  guardianPhone?: string;

  @IsOptional()
  @IsBoolean()
  isExpatriate?: boolean;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  expatriateCountry?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  expatriateOccupation?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  expatriateContact?: string;

  // Education & Employment
  @IsOptional()
  @IsEnum(EducationLevel)
  educationLevel?: EducationLevel;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  educationDetails?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  institution?: string;

  @IsOptional()
  @IsEnum(EmploymentStatus)
  employmentStatus?: EmploymentStatus;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  jobTitle?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  employerOrBusiness?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  skills?: string[];

  @IsOptional()
  @IsBoolean()
  isJobSeeker?: boolean;

  @IsOptional()
  educationHistory?: any;

  // Health & Support Profile
  @IsOptional()
  @ValidateNested()
  @Type(() => MemberHealthProfileDto)
  healthProfile?: MemberHealthProfileDto;
}

