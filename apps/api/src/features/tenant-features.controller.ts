import { Body, Controller, Get, HttpCode, HttpStatus, Param, Patch, Req, UseGuards } from "@nestjs/common";
import type { Request } from "express";
import type { PlatformMembership } from "@mahalle/database";
import { PlatformRole } from "@mahalle/types";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { PlatformContextGuard } from "../platform/guards/platform-context.guard";
import { CurrentPlatformMembership } from "../platform/decorators/current-platform-membership.decorator";
import { RequirePlatformRole } from "../common/decorators/require-platform-role.decorator";
import { FeaturesService } from "./features.service";
import { SetTenantFeatureOverrideDto } from "./dto/set-tenant-feature-override.dto";

function requestContext(req: Request) {
  return { ipAddress: req.ip, userAgent: req.headers["user-agent"] };
}

@Controller("platform/tenants/:tenantId/features")
@UseGuards(JwtAuthGuard, PlatformContextGuard)
export class TenantFeaturesController {
  constructor(private readonly featuresService: FeaturesService) {}

  @Get()
  async list(@Param("tenantId") tenantId: string) {
    const features = await this.featuresService.getTenantFeatures(tenantId);
    return { features };
  }

  @Patch(":featureId")
  @RequirePlatformRole(PlatformRole.SUPER_ADMIN)
  @HttpCode(HttpStatus.OK)
  async setOverride(
    @Param("tenantId") tenantId: string,
    @Param("featureId") featureId: string,
    @Body() dto: SetTenantFeatureOverrideDto,
    @CurrentPlatformMembership() membership: PlatformMembership,
    @Req() req: Request
  ) {
    const feature = await this.featuresService.setTenantOverride(
      tenantId,
      featureId,
      dto.isEnabled,
      membership.userId,
      requestContext(req)
    );
    return { feature };
  }
}
