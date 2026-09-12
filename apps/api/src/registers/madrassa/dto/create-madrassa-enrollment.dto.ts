import { IsBoolean, IsDateString, IsOptional, IsString, MaxLength, MinLength } from "class-validator";

export class CreateMadrassaEnrollmentDto {
  @IsString() @MinLength(1) @MaxLength(255) studentName!: string;
  @IsOptional() @IsString() studentMemberId?: string;
  @IsOptional() @IsString() @MaxLength(255) guardianName?: string;
  @IsOptional() @IsString() @MaxLength(50) guardianPhone?: string;
  @IsOptional() @IsString() @MaxLength(100) className?: string;
  @IsDateString() admissionDate!: string;
  @IsOptional() @IsBoolean() isActive?: boolean;
  @IsOptional() @IsString() @MaxLength(2000) remarks?: string;
}
