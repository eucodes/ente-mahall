import { Module } from "@nestjs/common";
import { PlatformModule } from "../platform/platform.module";
import { FeaturesModule } from "../features/features.module";
import { AnalyticsController } from "./analytics.controller";
import { TenantAnalyticsController } from "./tenant-analytics.controller";
import { AnalyticsService } from "./analytics.service";

@Module({
  imports: [PlatformModule, FeaturesModule],
  controllers: [AnalyticsController, TenantAnalyticsController],
  providers: [AnalyticsService]
})
export class AnalyticsModule {}
