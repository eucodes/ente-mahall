import { Module } from "@nestjs/common";
import { TenantsModule } from "../tenants/tenants.module";
import { MembershipsModule } from "../memberships/memberships.module";
import { PermissionsModule } from "../permissions/permissions.module";
import { HousesController } from "./houses.controller";
import { HousesService } from "./houses.service";

@Module({
  imports: [TenantsModule, MembershipsModule, PermissionsModule],
  controllers: [HousesController],
  providers: [HousesService],
  exports: [HousesService]
})
export class HousesModule {}
