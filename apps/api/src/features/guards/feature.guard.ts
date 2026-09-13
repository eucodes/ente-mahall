import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import type { Request } from "express";
import type { Tenant } from "@mahalle/database";
import { REQUIRE_FEATURE_KEY } from "../../common/decorators/require-feature.decorator";
import { FeaturesService } from "../features.service";

/**
 * Ensures that a route requiring a specific feature cannot be accessed if that
 * feature has been disabled globally, restricted by plan, or overridden to disabled
 * for the target Mahalle.
 */
@Injectable()
export class FeatureGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly featuresService: FeaturesService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredFeature = this.reflector.getAllAndOverride<string | undefined>(REQUIRE_FEATURE_KEY, [
      context.getHandler(),
      context.getClass()
    ]);

    if (!requiredFeature) {
      return true;
    }

    const request = context.switchToHttp().getRequest<Request & { tenant?: Tenant }>();
    const tenant = request.tenant;

    if (!tenant) {
      return true;
    }

    const features = await this.featuresService.getTenantFeatures(tenant.id);
    const featureStatus = features.find((f) => f.key === requiredFeature);

    if (!featureStatus || !featureStatus.effective) {
      throw new ForbiddenException(
        `The '${requiredFeature}' feature is disabled for this Mahalle. Please contact platform administration to enable it.`
      );
    }

    return true;
  }
}
