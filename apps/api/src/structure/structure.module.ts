import { Module } from "@nestjs/common";
import { TenantsModule } from "../tenants/tenants.module";
import { MembershipsModule } from "../memberships/memberships.module";
import { PermissionsModule } from "../permissions/permissions.module";
import { StructureController } from "./structure.controller";
import { StructureService } from "./structure.service";

@Module({
  imports: [TenantsModule, MembershipsModule, PermissionsModule],
  controllers: [StructureController],
  providers: [StructureService],
  exports: [StructureService]
})
export class StructureModule {}
