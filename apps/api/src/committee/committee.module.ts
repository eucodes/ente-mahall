import { Module } from "@nestjs/common";
import { TenantsModule } from "../tenants/tenants.module";
import { MembershipsModule } from "../memberships/memberships.module";
import { PermissionsModule } from "../permissions/permissions.module";
import { CommitteeController } from "./committee.controller";
import { CommitteeService } from "./committee.service";

@Module({
  imports: [TenantsModule, MembershipsModule, PermissionsModule],
  controllers: [CommitteeController],
  providers: [CommitteeService]
})
export class CommitteeModule {}
