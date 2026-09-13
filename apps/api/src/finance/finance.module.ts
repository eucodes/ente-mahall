import { Module } from "@nestjs/common";
import { TenantsModule } from "../tenants/tenants.module";
import { MembershipsModule } from "../memberships/memberships.module";
import { PermissionsModule } from "../permissions/permissions.module";
import { CertificateService } from "../registers/certificates/certificate.service";
import { FinanceController } from "./finance.controller";
import { FinanceService } from "./finance.service";
import { AccountingService } from "./accounting.service";
import { CollectionsService } from "./collections.service";
import { ExpensesService } from "./expenses.service";
import { SalaryService } from "./salary.service";
import { DuesService } from "./dues.service";
import { InterestFreeBankingService } from "./interest-free.service";
import { TaxesLegalService } from "./taxes-legal.service";
import { FinanceSettingsService } from "./finance-settings.service";
import { FinanceReportsService } from "./finance-reports.service";

@Module({
  imports: [TenantsModule, MembershipsModule, PermissionsModule],
  controllers: [FinanceController],
  providers: [
    FinanceService,
    AccountingService,
    CollectionsService,
    ExpensesService,
    SalaryService,
    DuesService,
    InterestFreeBankingService,
    TaxesLegalService,
    FinanceSettingsService,
    FinanceReportsService,
    CertificateService
  ],
  exports: [
    FinanceService,
    AccountingService,
    CollectionsService,
    ExpensesService,
    SalaryService,
    DuesService,
    InterestFreeBankingService,
    TaxesLegalService,
    FinanceSettingsService,
    FinanceReportsService
  ]
})
export class FinanceModule {}
