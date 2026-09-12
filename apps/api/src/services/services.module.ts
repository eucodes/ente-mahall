import { Module } from "@nestjs/common";
import { TenantsModule } from "../tenants/tenants.module";
import { MembershipsModule } from "../memberships/memberships.module";
import { PermissionsModule } from "../permissions/permissions.module";
import { ServicesController } from "./services.controller";
import { ServicesService } from "./services.service";

@Module({
  imports: [TenantsModule, MembershipsModule, PermissionsModule],
  controllers: [ServicesController],
  providers: [ServicesService]
})
export class ServicesModule {}
