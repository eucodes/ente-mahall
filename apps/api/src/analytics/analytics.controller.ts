import { Controller, Get, Query, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { PlatformContextGuard } from "../platform/guards/platform-context.guard";
import { AnalyticsService } from "./analytics.service";

@Controller("platform/analytics")
@UseGuards(JwtAuthGuard, PlatformContextGuard)
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get("overview")
  async overview() {
    const overview = await this.analyticsService.getPlatformOverview();
    return { overview };
  }

  @Get("mahalle-growth")
  async mahalleGrowth(@Query("months") months?: string) {
    const parsed = Math.min(24, Math.max(1, parseInt(months ?? "6", 10) || 6));
    const growth = await this.analyticsService.getMahalleGrowth(parsed);
    return { growth };
  }
}
