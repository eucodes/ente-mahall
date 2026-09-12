import { Module } from "@nestjs/common";
import { TenantsModule } from "../../tenants/tenants.module";
import { MembershipsModule } from "../../memberships/memberships.module";
import { PermissionsModule } from "../../permissions/permissions.module";
import { CertificateService } from "../certificates/certificate.service";
import { DeathController } from "./death.controller";
import { DeathService } from "./death.service";

@Module({
  imports: [TenantsModule, MembershipsModule, PermissionsModule],
  controllers: [DeathController],
  providers: [DeathService, CertificateService]
})
export class DeathModule {}
