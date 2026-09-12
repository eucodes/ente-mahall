import { Module } from "@nestjs/common";
import { TenantsModule } from "../tenants/tenants.module";
import { MembershipsModule } from "../memberships/memberships.module";
import { PermissionsModule } from "../permissions/permissions.module";
import { ActivityController } from "./activity.controller";
import { ActivityService } from "./activity.service";

@Module({
  imports: [TenantsModule, MembershipsModule, PermissionsModule],
  controllers: [ActivityController],
  providers: [ActivityService]
})
export class ActivityModule {}
