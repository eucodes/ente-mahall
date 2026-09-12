import { IsDateString, IsOptional, IsString, MaxLength, MinLength } from "class-validator";

export class CreateReleaseRecordDto {
  @IsOptional() @IsString() memberId?: string;
  @IsString() @MinLength(1) @MaxLength(255) memberName!: string;
  @IsOptional() @IsString() familyId?: string;

  @IsDateString() releaseDate!: string;

  @IsOptional() @IsString() @MaxLength(500) reason?: string;
  @IsOptional() @IsString() @MaxLength(255) destinationMahallu?: string;
  @IsOptional() @IsString() @MaxLength(2000) remarks?: string;
}
