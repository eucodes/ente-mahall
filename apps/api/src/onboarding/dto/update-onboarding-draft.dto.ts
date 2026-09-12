import { IsIn, IsObject, IsOptional } from "class-validator";

const STEPS = ["mahalle", "location", "profile", "structure", "management", "review"] as const;

/**
 * The draft's `data` is intentionally untyped/unvalidated here — it is
 * per-user scratch state for a wizard still in progress, not a record that
 * anything else reads. The one real validation pass happens once, when the
 * assembled data is finally submitted to POST /tenants (CreateTenantDto).
 */
export class UpdateOnboardingDraftDto {
  @IsOptional()
  @IsIn(STEPS)
  currentStep?: (typeof STEPS)[number];

  @IsOptional()
  @IsObject()
  data?: Record<string, unknown>;
}
