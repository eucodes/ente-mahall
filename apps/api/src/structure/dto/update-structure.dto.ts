import { IsBoolean, IsIn, IsOptional, IsString, MaxLength } from "class-validator";

const HOUSE_NUMBERING_METHODS = ["NUMERIC", "ALPHANUMERIC", "CUSTOM"] as const;

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
}
