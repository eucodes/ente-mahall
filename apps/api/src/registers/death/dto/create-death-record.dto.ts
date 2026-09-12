import { Gender } from "@mahalle/database";
import { IsDateString, IsEnum, IsOptional, IsString, MaxLength, MinLength } from "class-validator";

export class CreateDeathRecordDto {
  @IsOptional()
  @IsString()
  memberId?: string;

  @IsString()
  @MinLength(1)
  @MaxLength(255)
  deceasedName!: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  fatherOrGuardianName?: string;

  @IsOptional()
  @IsEnum(Gender)
  gender?: Gender;

  @IsOptional()
  @IsDateString()
  dateOfBirth?: string;

  @IsDateString()
  dateOfDeath!: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  placeOfDeath?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  causeOfDeath?: string;

  @IsOptional()
  @IsDateString()
  burialDate?: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  remarks?: string;
}
