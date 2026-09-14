import { Module } from "@nestjs/common";
import { TenantsModule } from "../tenants/tenants.module";
import { MembershipsModule } from "../memberships/memberships.module";
import { PermissionsModule } from "../permissions/permissions.module";
import { FamiliesModule } from "../families/families.module";
import { MembersController } from "./members.controller";
import { MembersService } from "./members.service";
import { EducationEmploymentController } from "./education-employment.controller";
import { EducationEmploymentService } from "./education-employment.service";
import { HealthSupportController } from "./health-support.controller";
import { HealthSupportService } from "./health-support.service";

@Module({
  // TenantContextGuard/PermissionGuard are exported by TenantsModule, but
  // they in turn depend on MembershipsService/PermissionsService — Nest
  // resolves a controller's @UseGuards() against its OWN module's injector
  // context, so those providers need to be reachable here too, not just
  // inside TenantsModule.
  imports: [TenantsModule, MembershipsModule, PermissionsModule, FamiliesModule],
  controllers: [MembersController, EducationEmploymentController, HealthSupportController],
  providers: [MembersService, EducationEmploymentService, HealthSupportService],
  exports: [MembersService, EducationEmploymentService, HealthSupportService]
})
export class MembersModule {}
