import { Module } from "@nestjs/common";
import { TenantsModule } from "../../tenants/tenants.module";
import { MembershipsModule } from "../../memberships/memberships.module";
import { PermissionsModule } from "../../permissions/permissions.module";
import { CertificateService } from "../certificates/certificate.service";
import { MarriageController } from "./marriage.controller";
import { MarriageService } from "./marriage.service";

@Module({
  imports: [TenantsModule, MembershipsModule, PermissionsModule],
  controllers: [MarriageController],
  providers: [MarriageService, CertificateService]
})
export class MarriageModule {}
