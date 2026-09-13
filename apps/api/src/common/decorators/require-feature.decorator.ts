import { SetMetadata } from "@nestjs/common";

export const REQUIRE_FEATURE_KEY = "require_feature";

/**
 * Declares that a route requires a specific feature flag to be enabled for the
 * current tenant. If the feature is disabled globally or overridden to false for
 * this Mahalle, FeatureGuard will reject the request with a 403 Forbidden.
 */
export const RequireFeature = (featureKey: string) => SetMetadata(REQUIRE_FEATURE_KEY, featureKey);
