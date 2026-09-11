import { Module } from "@nestjs/common";
import { TenantsModule } from "../tenants/tenants.module";
import { MembershipsModule } from "../memberships/memberships.module";
import { PermissionsModule } from "../permissions/permissions.module";
import { FamiliesController } from "./families.controller";
import { FamiliesService } from "./families.service";

@Module({
  imports: [TenantsModule, MembershipsModule, PermissionsModule],
  controllers: [FamiliesController],
  providers: [FamiliesService],
  exports: [FamiliesService]
})
export class FamiliesModule {}
