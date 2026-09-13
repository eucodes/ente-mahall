import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Req, UseGuards } from "@nestjs/common";
import type { Request } from "express";
import type { PlatformMembership } from "@mahalle/database";
import { PlatformRole } from "@mahalle/types";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { PlatformContextGuard } from "../platform/guards/platform-context.guard";
import { CurrentPlatformMembership } from "../platform/decorators/current-platform-membership.decorator";
import { RequirePlatformRole } from "../common/decorators/require-platform-role.decorator";
import { BillingService } from "./billing.service";
import { CreatePlanDto } from "./dto/create-plan.dto";
import { UpdatePlanDto } from "./dto/update-plan.dto";
import { SetPlanFeaturesDto } from "./dto/set-plan-features.dto";

function requestContext(req: Request) {
  return { ipAddress: req.ip, userAgent: req.headers["user-agent"] };
}

@Controller("platform/plans")
@UseGuards(JwtAuthGuard, PlatformContextGuard)
export class PlansController {
  constructor(private readonly billingService: BillingService) {}

  @Get()
  async list() {
    const plans = await this.billingService.listPlans();
    return { plans };
  }

  @Post()
  @RequirePlatformRole(PlatformRole.SUPER_ADMIN)
  async create(@Body() dto: CreatePlanDto, @CurrentPlatformMembership() membership: PlatformMembership, @Req() req: Request) {
    const plan = await this.billingService.createPlan(dto, membership.userId, requestContext(req));
    return { plan };
  }

  @Patch(":planId")
  @RequirePlatformRole(PlatformRole.SUPER_ADMIN)
  @HttpCode(HttpStatus.OK)
  async update(
    @Param("planId") planId: string,
    @Body() dto: UpdatePlanDto,
    @CurrentPlatformMembership() membership: PlatformMembership,
    @Req() req: Request
  ) {
    const plan = await this.billingService.updatePlan(planId, dto, membership.userId, requestContext(req));
    return { plan };
  }

  @Delete(":planId")
  @RequirePlatformRole(PlatformRole.SUPER_ADMIN)
  @HttpCode(HttpStatus.OK)
  async remove(
    @Param("planId") planId: string,
    @CurrentPlatformMembership() membership: PlatformMembership,
    @Req() req: Request
  ) {
    await this.billingService.deletePlan(planId, membership.userId, requestContext(req));
    return { success: true };
  }

  @Patch(":planId/features")
  @RequirePlatformRole(PlatformRole.SUPER_ADMIN)
  @HttpCode(HttpStatus.OK)
  async setFeatures(
    @Param("planId") planId: string,
    @Body() dto: SetPlanFeaturesDto,
    @CurrentPlatformMembership() membership: PlatformMembership,
    @Req() req: Request
  ) {
    const plan = await this.billingService.setPlanFeatures(planId, dto.featureIds, membership.userId, requestContext(req));
    return { plan };
  }
}
