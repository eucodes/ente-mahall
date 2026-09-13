import { ArrayMaxSize, IsArray, IsBoolean, IsEnum, IsInt, IsOptional, IsString, Matches, MaxLength, Min } from "class-validator";
import { FormFieldType } from "@mahalle/types";

export class UpsertFormFieldDto {
  @IsString()
  @MaxLength(100)
  @Matches(/^[a-z0-9_]+$/, { message: "key must be lowercase letters, numbers, and underscores only" })
  key!: string;

  @IsString()
  @MaxLength(200)
  label!: string;

  @IsEnum(FormFieldType)
  type!: FormFieldType;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @IsOptional()
  @IsBoolean()
  required?: boolean;

  @IsInt()
  @Min(0)
  order!: number;

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(100)
  @IsString({ each: true })
  options?: string[];
}
