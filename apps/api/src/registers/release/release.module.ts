import { Module } from "@nestjs/common";
import { TenantsModule } from "../../tenants/tenants.module";
import { MembershipsModule } from "../../memberships/memberships.module";
import { PermissionsModule } from "../../permissions/permissions.module";
import { CertificateService } from "../certificates/certificate.service";
import { ReleaseController } from "./release.controller";
import { ReleaseService } from "./release.service";

@Module({
  imports: [TenantsModule, MembershipsModule, PermissionsModule],
  controllers: [ReleaseController],
  providers: [ReleaseService, CertificateService]
})
export class ReleaseModule {}
