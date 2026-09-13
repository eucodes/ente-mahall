import { Type } from "class-transformer";
import { ArrayMinSize, IsArray, IsDateString, IsNumberString, IsOptional, IsString, MaxLength, MinLength, ValidateNested } from "class-validator";

export class JournalEntryLineDto {
  @IsString() accountId!: string;
  @IsNumberString() debit!: string;
  @IsNumberString() credit!: string;
  @IsOptional() @IsString() @MaxLength(500) description?: string;
}

export class CreateJournalEntryDto {
  @IsOptional() @IsDateString() date?: string;
  @IsOptional() @IsString() financialYearId?: string;
  @IsOptional() @IsString() @MaxLength(255) reference?: string;
  @IsString() @MinLength(1) @MaxLength(1000) description!: string;
  @IsOptional() @IsString() @MaxLength(50) sourceType?: string;
  @IsOptional() @IsString() sourceId?: string;
  @IsArray()
  @ArrayMinSize(2)
  @ValidateNested({ each: true })
  @Type(() => JournalEntryLineDto)
  lines!: JournalEntryLineDto[];
}
