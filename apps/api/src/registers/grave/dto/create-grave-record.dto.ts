import { IsDateString, IsOptional, IsString, MaxLength, MinLength } from "class-validator";

export class CreateGraveRecordDto {
  @IsOptional() @IsString() deathRecordId?: string;
  @IsString() @MinLength(1) @MaxLength(255) deceasedName!: string;
  @IsString() @MinLength(1) @MaxLength(100) plotNumber!: string;
  @IsOptional() @IsString() @MaxLength(100) section?: string;
  @IsDateString() burialDate!: string;
  @IsOptional() @IsString() @MaxLength(2000) remarks?: string;
}
