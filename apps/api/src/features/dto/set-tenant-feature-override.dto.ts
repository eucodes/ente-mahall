import { IsBoolean, IsOptional } from "class-validator";

export class SetTenantFeatureOverrideDto {
  /** Omit or null to clear the override and inherit the platform default. */
  @IsOptional()
  @IsBoolean()
  isEnabled?: boolean | null;
}
