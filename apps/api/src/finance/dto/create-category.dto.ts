import { IsArray, IsBoolean, IsIn, IsInt, IsOptional, IsString, MaxLength, MinLength } from "class-validator";

export class CreateCollectionCategoryDto {
  @IsString() @MinLength(1) @MaxLength(255) name!: string;
  @IsOptional() @IsString() @MaxLength(50) code?: string;
  @IsOptional() @IsString() @MaxLength(1000) description?: string;
  @IsOptional() @IsString() incomeAccountId?: string;
  @IsOptional() @IsString() @IsIn(["ALL_FAMILIES", "SPECIFIC_DIVISIONS", "CATEGORY_BASED", "GENERAL"]) targetType?: string;
  @IsOptional() @IsBoolean() isRecurring?: boolean;
  @IsOptional() @IsString() @IsIn(["MONTHLY", "ANNUAL", "ONE_TIME"]) recurrenceFrequency?: string;
  @IsOptional() @IsString() targetEconomicCategory?: string;
  @IsOptional() @IsArray() @IsString({ each: true }) targetDivisionIds?: string[];
  @IsOptional() defaultAmount?: number | string | null;
  @IsOptional() @IsBoolean() isActive?: boolean;
  @IsOptional() @IsInt() displayOrder?: number;
}

export class UpdateCollectionCategoryDto {
  @IsOptional() @IsString() @MinLength(1) @MaxLength(255) name?: string;
  @IsOptional() @IsString() @MaxLength(50) code?: string;
  @IsOptional() @IsString() @MaxLength(1000) description?: string;
  @IsOptional() @IsString() incomeAccountId?: string | null;
  @IsOptional() @IsString() @IsIn(["ALL_FAMILIES", "SPECIFIC_DIVISIONS", "CATEGORY_BASED", "GENERAL"]) targetType?: string;
  @IsOptional() @IsBoolean() isRecurring?: boolean;
  @IsOptional() @IsString() @IsIn(["MONTHLY", "ANNUAL", "ONE_TIME"]) recurrenceFrequency?: string;
  @IsOptional() @IsString() targetEconomicCategory?: string | null;
  @IsOptional() @IsArray() @IsString({ each: true }) targetDivisionIds?: string[];
  @IsOptional() defaultAmount?: number | string | null;
  @IsOptional() @IsBoolean() isActive?: boolean;
  @IsOptional() @IsInt() displayOrder?: number;
}

export class CreateExpenseCategoryDto {
  @IsString() @MinLength(1) @MaxLength(255) name!: string;
  @IsOptional() @IsString() @MaxLength(50) code?: string;
  @IsOptional() @IsString() @MaxLength(1000) description?: string;
  @IsOptional() @IsString() expenseAccountId?: string;
  @IsOptional() @IsBoolean() isActive?: boolean;
  @IsOptional() @IsInt() displayOrder?: number;
}

export class UpdateExpenseCategoryDto {
  @IsOptional() @IsString() @MinLength(1) @MaxLength(255) name?: string;
  @IsOptional() @IsString() @MaxLength(50) code?: string;
  @IsOptional() @IsString() @MaxLength(1000) description?: string;
  @IsOptional() @IsString() expenseAccountId?: string | null;
  @IsOptional() @IsBoolean() isActive?: boolean;
  @IsOptional() @IsInt() displayOrder?: number;
}
