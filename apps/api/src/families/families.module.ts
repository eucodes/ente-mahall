import { Module } from "@nestjs/common";
import { TenantsModule } from "../tenants/tenants.module";
import { MembershipsModule } from "../memberships/memberships.module";
import { PermissionsModule } from "../permissions/permissions.module";
import { HousesModule } from "../houses/houses.module";
import { CertificateService } from "../registers/certificates/certificate.service";
import { FamiliesController } from "./families.controller";
import { FamiliesService } from "./families.service";

@Module({
  imports: [TenantsModule, MembershipsModule, PermissionsModule, HousesModule],
  controllers: [FamiliesController],
  providers: [FamiliesService, CertificateService],
  exports: [FamiliesService]
})
export class FamiliesModule {}
