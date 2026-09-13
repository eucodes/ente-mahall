import { Global, Module, forwardRef } from "@nestjs/common";
import { PlatformModule } from "../platform/platform.module";
import { FeaturesController } from "./features.controller";
import { TenantFeaturesController } from "./tenant-features.controller";
import { FeaturesService } from "./features.service";
import { FeatureGuard } from "./guards/feature.guard";

@Global()
@Module({
  imports: [forwardRef(() => PlatformModule)],
  controllers: [FeaturesController, TenantFeaturesController],
  providers: [FeaturesService, FeatureGuard],
  exports: [FeaturesService, FeatureGuard]
})
export class FeaturesModule {}


