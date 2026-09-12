import { Module } from "@nestjs/common";
import { TenantsModule } from "../../tenants/tenants.module";
import { MembershipsModule } from "../../memberships/memberships.module";
import { PermissionsModule } from "../../permissions/permissions.module";
import { GraveController } from "./grave.controller";
import { GraveService } from "./grave.service";

@Module({
  imports: [TenantsModule, MembershipsModule, PermissionsModule],
  controllers: [GraveController],
  providers: [GraveService]
})
export class GraveModule {}
