import { Module } from "@nestjs/common";
import { PlatformModule } from "../platform/platform.module";
import { PlansController } from "./plans.controller";
import { TenantBillingController } from "./tenant-billing.controller";
import { BillingService } from "./billing.service";

@Module({
  imports: [PlatformModule],
  controllers: [PlansController, TenantBillingController],
  providers: [BillingService]
})
export class BillingModule {}
