import { IsArray, IsBoolean, IsIn, IsInt, IsOptional, IsString, MaxLength, MinLength } from "class-validator";

export class CreateCollectionCategoryDto {
  @IsString() @MinLength(1) @MaxLength(255) name!: string;
  @IsOptional() @IsString() fundId?: string | null;
  @IsOptional() @IsString() @MaxLength(50) code?: string;
  @IsOptional() @IsString() @MaxLength(1000) description?: string;
  @IsOptional() @IsString() incomeAccountId?: string | null;
  @IsOptional() @IsString() targetType?: string; // NO_TARGET, DIVISION_BASED, FAMILY_BASED, MEMBER_BASED, CUSTOM_TARGET, ALL_FAMILIES, SPECIFIC_DIVISIONS, CATEGORY_BASED, GENERAL
  @IsOptional() @IsBoolean() isRecurring?: boolean;
  @IsOptional() @IsBoolean() isSubscription?: boolean;
  @IsOptional() @IsString() recurrenceFrequency?: string; // DAILY, WEEKLY, MONTHLY, QUARTERLY, YEARLY, CUSTOM, ANNUAL, ONE_TIME
  @IsOptional() @IsBoolean() autoGenerate?: boolean;
  @IsOptional() @IsString() targetEconomicCategory?: string;
  @IsOptional() @IsArray() @IsString({ each: true }) targetDivisionIds?: string[];
  @IsOptional() targetAmount?: number | string | null;
  @IsOptional() defaultAmount?: number | string | null;
  @IsOptional() targetConfig?: any;
  @IsOptional() formConfig?: any;
  @IsOptional() @IsBoolean() isActive?: boolean;
  @IsOptional() @IsInt() displayOrder?: number;
}

export class UpdateCollectionCategoryDto {
  @IsOptional() @IsString() @MinLength(1) @MaxLength(255) name?: string;
  @IsOptional() @IsString() fundId?: string | null;
  @IsOptional() @IsString() @MaxLength(50) code?: string;
  @IsOptional() @IsString() @MaxLength(1000) description?: string;
  @IsOptional() @IsString() incomeAccountId?: string | null;
  @IsOptional() @IsString() targetType?: string;
  @IsOptional() @IsBoolean() isRecurring?: boolean;
  @IsOptional() @IsBoolean() isSubscription?: boolean;
  @IsOptional() @IsString() recurrenceFrequency?: string;
  @IsOptional() @IsBoolean() autoGenerate?: boolean;
  @IsOptional() @IsString() targetEconomicCategory?: string | null;
  @IsOptional() @IsArray() @IsString({ each: true }) targetDivisionIds?: string[];
  @IsOptional() targetAmount?: number | string | null;
  @IsOptional() defaultAmount?: number | string | null;
  @IsOptional() targetConfig?: any;
  @IsOptional() formConfig?: any;
  @IsOptional() @IsBoolean() isActive?: boolean;
  @IsOptional() @IsInt() displayOrder?: number;
}

export class CreateExpenseCategoryDto {
  @IsString() @MinLength(1) @MaxLength(255) name!: string;
  @IsOptional() @IsString() fundId?: string | null;
  @IsOptional() @IsString() @MaxLength(50) code?: string;
  @IsOptional() @IsString() @MaxLength(1000) description?: string;
  @IsOptional() @IsString() expenseAccountId?: string | null;
  @IsOptional() @IsBoolean() isActive?: boolean;
  @IsOptional() @IsInt() displayOrder?: number;
}

export class UpdateExpenseCategoryDto {
  @IsOptional() @IsString() @MinLength(1) @MaxLength(255) name?: string;
  @IsOptional() @IsString() fundId?: string | null;
  @IsOptional() @IsString() @MaxLength(50) code?: string;
  @IsOptional() @IsString() @MaxLength(1000) description?: string;
  @IsOptional() @IsString() expenseAccountId?: string | null;
  @IsOptional() @IsBoolean() isActive?: boolean;
  @IsOptional() @IsInt() displayOrder?: number;
}

