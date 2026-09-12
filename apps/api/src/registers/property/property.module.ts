import { Module } from "@nestjs/common";
import { TenantsModule } from "../../tenants/tenants.module";
import { MembershipsModule } from "../../memberships/memberships.module";
import { PermissionsModule } from "../../permissions/permissions.module";
import { PropertyController } from "./property.controller";
import { PropertyService } from "./property.service";

@Module({
  imports: [TenantsModule, MembershipsModule, PermissionsModule],
  controllers: [PropertyController],
  providers: [PropertyService]
})
export class PropertyModule {}
