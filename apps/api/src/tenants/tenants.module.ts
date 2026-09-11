import { Module } from "@nestjs/common";
import { MembershipsModule } from "../memberships/memberships.module";
import { UsersModule } from "../users/users.module";
import { PermissionsModule } from "../permissions/permissions.module";
import { TenantsController } from "./tenants.controller";
import { TenantsService } from "./tenants.service";
import { AdminsController } from "./admins.controller";
import { AdminsService } from "./admins.service";
import { TenantContextGuard } from "./guards/tenant-context.guard";
import { PermissionGuard } from "./guards/permission.guard";

@Module({
  imports: [MembershipsModule, UsersModule, PermissionsModule],
  controllers: [TenantsController, AdminsController],
  providers: [TenantsService, AdminsService, TenantContextGuard, PermissionGuard],
  exports: [TenantsService, TenantContextGuard, PermissionGuard]
})
export class TenantsModule {}
