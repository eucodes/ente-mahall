import { IsDateString, IsOptional, IsString, MaxLength, MinLength } from "class-validator";

export class CreateDivorceRecordDto {
  @IsString() @MinLength(1) @MaxLength(255) husbandName!: string;
  @IsOptional() @IsString() husbandMemberId?: string;

  @IsString() @MinLength(1) @MaxLength(255) wifeName!: string;
  @IsOptional() @IsString() wifeMemberId?: string;

  @IsOptional() @IsString() @MaxLength(100) divorceType?: string;
  @IsDateString() divorceDate!: string;

  @IsOptional() @IsString() @MaxLength(255) place?: string;
  @IsOptional() @IsString() @MaxLength(255) officiantName?: string;
  @IsOptional() @IsString() @MaxLength(2000) remarks?: string;
}
