import { CommitteeMeetingStatus } from "@mahalle/database";
import { IsArray, IsDateString, IsEnum, IsOptional, IsString, MaxLength, MinLength } from "class-validator";

export class CreateCommitteeMeetingDto {
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  title!: string;

  @IsDateString()
  meetingDate!: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  location?: string;

  @IsOptional()
  @IsString()
  @MaxLength(4000)
  agenda?: string;

  @IsOptional()
  @IsString()
  @MaxLength(8000)
  minutes?: string;

  @IsOptional()
  @IsEnum(CommitteeMeetingStatus)
  status?: CommitteeMeetingStatus;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  attendeeIds?: string[];
}
