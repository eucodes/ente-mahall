import { IsInt, IsOptional, IsString, Min, MaxLength, MinLength } from "class-validator";
import { PartialType } from "@nestjs/mapped-types";

export class CreateFamilyStatusDto {
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  name!: string;

  @IsOptional()
  @IsString()
  @MaxLength(30)
  code?: string;

  @IsOptional()
  @IsString()
  @MaxLength(30)
  color?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  order?: number;
}

export class UpdateFamilyStatusDto extends PartialType(CreateFamilyStatusDto) {}
