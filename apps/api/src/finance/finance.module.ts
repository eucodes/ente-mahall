import { Module } from "@nestjs/common";
import { TenantsModule } from "../tenants/tenants.module";
import { MembershipsModule } from "../memberships/memberships.module";
import { PermissionsModule } from "../permissions/permissions.module";
import { CertificateService } from "../registers/certificates/certificate.service";
import { FinanceController } from "./finance.controller";
import { FinanceService } from "./finance.service";

@Module({
  imports: [TenantsModule, MembershipsModule, PermissionsModule],
  controllers: [FinanceController],
  providers: [FinanceService, CertificateService]
})
export class FinanceModule {}
