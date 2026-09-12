import { Module } from "@nestjs/common";
import { TenantsModule } from "../../tenants/tenants.module";
import { MembershipsModule } from "../../memberships/memberships.module";
import { PermissionsModule } from "../../permissions/permissions.module";
import { CertificateService } from "../certificates/certificate.service";
import { DivorceController } from "./divorce.controller";
import { DivorceService } from "./divorce.service";

@Module({
  imports: [TenantsModule, MembershipsModule, PermissionsModule],
  controllers: [DivorceController],
  providers: [DivorceService, CertificateService]
})
export class DivorceModule {}
