import { Module } from "@nestjs/common";
import { TenantsModule } from "../../tenants/tenants.module";
import { MembershipsModule } from "../../memberships/memberships.module";
import { PermissionsModule } from "../../permissions/permissions.module";
import { MadrassaController } from "./madrassa.controller";
import { MadrassaService } from "./madrassa.service";

@Module({
  imports: [TenantsModule, MembershipsModule, PermissionsModule],
  controllers: [MadrassaController],
  providers: [MadrassaService]
})
export class MadrassaModule {}
