import { IsBoolean, IsIn, IsInt, IsOptional, IsString, Max, MaxLength, Min } from "class-validator";

const HOUSE_NUMBERING_METHODS = ["NUMERIC", "ALPHANUMERIC", "CUSTOM", "PER_DIVISION", "GLOBAL"] as const;

/** Structure is per-tenant configuration, not code — see UpdateStructureDto for the one place a Mahallu's own terminology is set. */
export class UpdateStructureDto {
  @IsOptional()
  @IsBoolean()
  hasDivisions?: boolean;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  divisionTerm?: string;

  @IsOptional()
  @IsIn(HOUSE_NUMBERING_METHODS)
  houseNumberingMethod?: (typeof HOUSE_NUMBERING_METHODS)[number];

  // House-number configuration — shapes new house numbers only; never
  // touches an existing House.displayNumber (see the schema comment).
  @IsOptional()
  @IsString()
  @MaxLength(20)
  houseNumberPrefix?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  houseNumberSuffix?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  houseNumberStartAt?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(10)
  houseNumberMinDigits?: number;

  @IsOptional()
  @IsBoolean()
  houseNumberAllowManual?: boolean;
}
