import { Module } from "@nestjs/common";
import { TenantsModule } from "../tenants/tenants.module";
import { MembershipsModule } from "../memberships/memberships.module";
import { PermissionsModule } from "../permissions/permissions.module";
import { FamiliesModule } from "../families/families.module";
import { MembersController } from "./members.controller";
import { MembersService } from "./members.service";

@Module({
  // TenantContextGuard/PermissionGuard are exported by TenantsModule, but
  // they in turn depend on MembershipsService/PermissionsService — Nest
  // resolves a controller's @UseGuards() against its OWN module's injector
  // context, so those providers need to be reachable here too, not just
  // inside TenantsModule.
  imports: [TenantsModule, MembershipsModule, PermissionsModule, FamiliesModule],
  controllers: [MembersController],
  providers: [MembersService],
  exports: [MembersService]
})
export class MembersModule {}
