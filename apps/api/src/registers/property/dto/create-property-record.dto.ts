import { PropertyType } from "@mahalle/database";
import { IsBoolean, IsDateString, IsEnum, IsOptional, IsString, MaxLength, MinLength } from "class-validator";

export class CreatePropertyRecordDto {
  @IsEnum(PropertyType) propertyType!: PropertyType;
  @IsString() @MinLength(1) @MaxLength(255) name!: string;
  @IsOptional() @IsString() @MaxLength(255) location?: string;
  @IsOptional() @IsString() @MaxLength(500) areaDetails?: string;
  @IsOptional() @IsString() @MaxLength(255) lesseeName?: string;
  @IsOptional() @IsString() @MaxLength(50) lesseePhone?: string;
  @IsOptional() @IsString() @MaxLength(100) rentAmount?: string;
  @IsOptional() @IsDateString() acquisitionDate?: string;
  @IsOptional() @IsBoolean() isActive?: boolean;
  @IsOptional() @IsString() @MaxLength(2000) remarks?: string;
}
