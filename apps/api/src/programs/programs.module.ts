import { Module } from "@nestjs/common";
import { TenantsModule } from "../tenants/tenants.module";
import { MembershipsModule } from "../memberships/memberships.module";
import { PermissionsModule } from "../permissions/permissions.module";
import { ProgramsController } from "./programs.controller";
import { ProgramsService } from "./programs.service";

@Module({
  imports: [TenantsModule, MembershipsModule, PermissionsModule],
  controllers: [ProgramsController],
  providers: [ProgramsService],
  exports: [ProgramsService]
})
export class ProgramsModule {}
