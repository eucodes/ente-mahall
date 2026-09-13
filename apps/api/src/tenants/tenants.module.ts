import { Module } from "@nestjs/common";
import { MembershipsModule } from "../memberships/memberships.module";
import { UsersModule } from "../users/users.module";
import { PermissionsModule } from "../permissions/permissions.module";
import { TenantsController } from "./tenants.controller";
import { TenantsService } from "./tenants.service";
import { AdminsController } from "./admins.controller";
import { AdminsService } from "./admins.service";
import { RolesController, PermissionsCatalogueController } from "./roles.controller";
import { RolesService } from "./roles.service";
import { TenantContextGuard } from "./guards/tenant-context.guard";
import { PermissionGuard } from "./guards/permission.guard";

@Module({
  imports: [MembershipsModule, UsersModule, PermissionsModule],
  controllers: [TenantsController, AdminsController, RolesController, PermissionsCatalogueController],
  providers: [TenantsService, AdminsService, RolesService, TenantContextGuard, PermissionGuard],
  exports: [TenantsService, AdminsService, RolesService, TenantContextGuard, PermissionGuard]
})
export class TenantsModule {}

