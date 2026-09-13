import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Req, UseGuards } from "@nestjs/common";
import type { Request } from "express";
import type { PlatformMembership } from "@mahalle/database";
import { PlatformRole } from "@mahalle/types";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { PlatformContextGuard } from "../platform/guards/platform-context.guard";
import { CurrentPlatformMembership } from "../platform/decorators/current-platform-membership.decorator";
import { RequirePlatformRole } from "../common/decorators/require-platform-role.decorator";
import { FeaturesService } from "./features.service";
import { CreateFeatureDto } from "./dto/create-feature.dto";
import { UpdateFeatureDto } from "./dto/update-feature.dto";

function requestContext(req: Request) {
  return { ipAddress: req.ip, userAgent: req.headers["user-agent"] };
}

@Controller("platform/features")
@UseGuards(JwtAuthGuard, PlatformContextGuard)
export class FeaturesController {
  constructor(private readonly featuresService: FeaturesService) {}

  @Get()
  async list() {
    const features = await this.featuresService.listFeatures();
    return { features };
  }

  @Post()
  @RequirePlatformRole(PlatformRole.SUPER_ADMIN)
  async create(
    @Body() dto: CreateFeatureDto,
    @CurrentPlatformMembership() membership: PlatformMembership,
    @Req() req: Request
  ) {
    const feature = await this.featuresService.createFeature(dto, membership.userId, requestContext(req));
    return { feature };
  }

  @Patch(":featureId")
  @RequirePlatformRole(PlatformRole.SUPER_ADMIN)
  @HttpCode(HttpStatus.OK)
  async update(
    @Param("featureId") featureId: string,
    @Body() dto: UpdateFeatureDto,
    @CurrentPlatformMembership() membership: PlatformMembership,
    @Req() req: Request
  ) {
    const feature = await this.featuresService.updateFeature(featureId, dto, membership.userId, requestContext(req));
    return { feature };
  }

  @Delete(":featureId")
  @RequirePlatformRole(PlatformRole.SUPER_ADMIN)
  @HttpCode(HttpStatus.OK)
  async remove(
    @Param("featureId") featureId: string,
    @CurrentPlatformMembership() membership: PlatformMembership,
    @Req() req: Request
  ) {
    await this.featuresService.deleteFeature(featureId, membership.userId, requestContext(req));
    return { success: true };
  }
}
