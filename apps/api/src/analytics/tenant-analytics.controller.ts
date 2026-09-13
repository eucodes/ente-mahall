import { Controller, Get, Param, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { PlatformContextGuard } from "../platform/guards/platform-context.guard";
import { AnalyticsService } from "./analytics.service";

@Controller("platform/tenants/:tenantId/analytics")
@UseGuards(JwtAuthGuard, PlatformContextGuard)
export class TenantAnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get()
  async get(@Param("tenantId") tenantId: string) {
    const analytics = await this.analyticsService.getTenantAnalytics(tenantId);
    return { analytics };
  }
}
