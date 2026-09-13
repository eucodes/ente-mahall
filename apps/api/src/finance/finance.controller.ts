import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Query, Req, UseGuards } from "@nestjs/common";
import type { Request } from "express";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { TenantContextGuard } from "../tenants/guards/tenant-context.guard";
import { FeatureGuard } from "../features/guards/feature.guard";
import { PermissionGuard } from "../tenants/guards/permission.guard";
import { RequirePermission } from "../common/decorators/require-permission.decorator";
import { RequireFeature } from "../common/decorators/require-feature.decorator";
import { CurrentMembership } from "../tenants/decorators/current-membership.decorator";
import type { MembershipWithRole } from "../memberships/memberships.service";
import { PaginationQueryDto } from "../common/dto/pagination-query.dto";

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

import { CreateAccountDto } from "./dto/create-account.dto";
import { UpdateAccountDto } from "./dto/update-account.dto";
import { CreateVoucherDto } from "./dto/create-voucher.dto";
import { UpdateVoucherDto } from "./dto/update-voucher.dto";
import { CreateDueDto } from "./dto/create-due.dto";
import { UpdateDueDto } from "./dto/update-due.dto";
import { MarkDuePaidDto } from "./dto/mark-due-paid.dto";
import { CreateSalaryRecordDto } from "./dto/create-salary-record.dto";
import { MarkSalaryPaidDto } from "./dto/mark-salary-paid.dto";
import { CreateCollectionDto } from "./dto/create-collection.dto";
import { CreateJournalEntryDto } from "./dto/create-journal-entry.dto";
import { CreateFinancialYearDto } from "./dto/create-financial-year.dto";
import { UpdateFinanceSettingsDto } from "./dto/update-finance-settings.dto";
import { CreatePaymentMethodDto, UpdatePaymentMethodDto } from "./dto/create-payment-method.dto";
import { CreateBankAccountDto, UpdateBankAccountDto } from "./dto/create-bank-account.dto";
import {
  CreateCollectionCategoryDto,
  UpdateCollectionCategoryDto,
  CreateExpenseCategoryDto,
  UpdateExpenseCategoryDto
} from "./dto/create-category.dto";
import { CreateInterestFreeAccountDto, CreateInterestFreeTransactionDto } from "./dto/create-interest-free.dto";
import { CreateTaxLegalFilingDto, UpdateTaxLegalFilingDto } from "./dto/create-tax-legal.dto";
import { CancelReasonDto } from "./dto/cancel-reason.dto";

function requestContext(req: Request) {
  return { ipAddress: req.ip, userAgent: req.headers["user-agent"] };
}

@Controller("tenants/:slug/finance")
@UseGuards(JwtAuthGuard, TenantContextGuard, FeatureGuard, PermissionGuard)
@RequireFeature("finance")
export class FinanceController {
  constructor(
    private readonly financeService: FinanceService,
    private readonly accountingService: AccountingService,
    private readonly collectionsService: CollectionsService,
    private readonly expensesService: ExpensesService,
    private readonly salaryService: SalaryService,
    private readonly duesService: DuesService,
    private readonly interestFreeService: InterestFreeBankingService,
    private readonly taxesLegalService: TaxesLegalService,
    private readonly settingsService: FinanceSettingsService,
    private readonly reportsService: FinanceReportsService
  ) {}

  // =========================================================================
  // 1. Overview & Dashboard
  // =========================================================================

  @Get("overview")
  @RequirePermission("finance.view")
  async getOverview(@CurrentMembership() membership: MembershipWithRole): Promise<any> {
    return this.financeService.getFinanceOverview(membership.tenantId);
  }

  @Get("summary")
  @RequirePermission("finance.view")
  async getSummary(@CurrentMembership() membership: MembershipWithRole): Promise<any> {
    return this.financeService.summary(membership.tenantId);
  }

  @Get("reports/summary")
  @RequirePermission("finance.view")
  async getReportsSummary(@CurrentMembership() membership: MembershipWithRole): Promise<any> {
    return this.financeService.summary(membership.tenantId);
  }

  @Get("reports/cash-book")
  @RequirePermission("finance.view")
  async getReportsCashBook(
    @CurrentMembership() membership: MembershipWithRole,
    @Query("startDate") startDate?: string,
    @Query("endDate") endDate?: string,
    @Query("financialYearId") financialYearId?: string
  ): Promise<any> {
    return this.accountingService.getCashBook(membership.tenantId, startDate, endDate, financialYearId);
  }

  // =========================================================================
  // 2. Chart of Accounts & Financial Years
  // =========================================================================

  @Get("accounts")
  @RequirePermission("finance.view")
  async listAccounts(@CurrentMembership() membership: MembershipWithRole): Promise<any> {
    return { accounts: await this.accountingService.listAccounts(membership.tenantId) };
  }

  @Get("accounts/hierarchy")
  @RequirePermission("finance.view")
  async getAccountHierarchy(@CurrentMembership() membership: MembershipWithRole): Promise<any> {
    return { tree: await this.accountingService.getAccountHierarchy(membership.tenantId) };
  }

  @Post("accounts")
  @RequirePermission("accounting.accounts.manage")
  async createAccount(@CurrentMembership() membership: MembershipWithRole, @Body() dto: CreateAccountDto, @Req() req: Request): Promise<any> {
    const account = await this.accountingService.createAccount(
      { userId: membership.userId, tenantId: membership.tenantId },
      dto,
      requestContext(req)
    );
    return { account };
  }

  @Patch("accounts/:id")
  @RequirePermission("accounting.accounts.manage")
  async updateAccount(
    @CurrentMembership() membership: MembershipWithRole,
    @Param("id") id: string,
    @Body() dto: UpdateAccountDto,
    @Req() req: Request
  ): Promise<any> {
    const account = await this.accountingService.updateAccount(
      { userId: membership.userId, tenantId: membership.tenantId },
      id,
      dto,
      requestContext(req)
    );
    return { account };
  }

  @Delete("accounts/:id")
  @RequirePermission("accounting.accounts.manage")
  async removeAccount(@CurrentMembership() membership: MembershipWithRole, @Param("id") id: string, @Req() req: Request): Promise<any> {
    await this.accountingService.removeAccount({ userId: membership.userId, tenantId: membership.tenantId }, id, requestContext(req));
    return { success: true };
  }

  @Get("financial-years")
  @RequirePermission("accounting.view")
  async listFinancialYears(@CurrentMembership() membership: MembershipWithRole): Promise<any> {
    return { financialYears: await this.accountingService.listFinancialYears(membership.tenantId) };
  }

  @Post("financial-years")
  @RequirePermission("accounting.accounts.manage")
  async createFinancialYear(
    @CurrentMembership() membership: MembershipWithRole,
    @Body() dto: CreateFinancialYearDto,
    @Req() req: Request
  ): Promise<any> {
    const fy = await this.accountingService.createFinancialYear(
      { userId: membership.userId, tenantId: membership.tenantId },
      dto,
      requestContext(req)
    );
    return { financialYear: fy };
  }

  @Post("financial-years/:id/close")
  @RequirePermission("accounting.accounts.manage")
  async closeFinancialYear(@CurrentMembership() membership: MembershipWithRole, @Param("id") id: string, @Req() req: Request): Promise<any> {
    return { financialYear: await this.accountingService.closeFinancialYear({ userId: membership.userId, tenantId: membership.tenantId }, id, requestContext(req)) };
  }

  @Post("financial-years/:id/reopen")
  @RequirePermission("accounting.accounts.manage")
  async reopenFinancialYear(@CurrentMembership() membership: MembershipWithRole, @Param("id") id: string, @Req() req: Request): Promise<any> {
    return { financialYear: await this.accountingService.reopenFinancialYear({ userId: membership.userId, tenantId: membership.tenantId }, id, requestContext(req)) };
  }

  @Post("financial-years/:id/set-current")
  @RequirePermission("accounting.accounts.manage")
  async setCurrentFinancialYear(@CurrentMembership() membership: MembershipWithRole, @Param("id") id: string, @Req() req: Request): Promise<any> {
    return this.accountingService.setCurrentFinancialYear({ userId: membership.userId, tenantId: membership.tenantId }, id, requestContext(req));
  }

  // =========================================================================
  // 3. Double-Entry Journal & Ledgers
  // =========================================================================

  @Get("journal-entries")
  @RequirePermission("accounting.view")
  async listJournalEntries(
    @CurrentMembership() membership: MembershipWithRole,
    @Query() query: PaginationQueryDto,
    @Query("status") status?: string
  ): Promise<any> {
    const page = query.page ?? 1;
    const pageSize = query.pageSize ?? 20;
    const { entries, total } = await this.accountingService.listJournalEntries(membership.tenantId, page, pageSize, status);
    return { journalEntries: entries, meta: { total, page, pageSize } };
  }

  @Get("journal-entries/:id")
  @RequirePermission("accounting.view")
  async getJournalEntry(@CurrentMembership() membership: MembershipWithRole, @Param("id") id: string): Promise<any> {
    return { journalEntry: await this.accountingService.getJournalEntry(membership.tenantId, id) };
  }

  @Post("journal-entries")
  @RequirePermission("accounting.journal.create")
  async createJournalEntry(
    @CurrentMembership() membership: MembershipWithRole,
    @Body() dto: CreateJournalEntryDto,
    @Req() req: Request
  ): Promise<any> {
    const entry = await this.accountingService.createJournalEntry(
      { userId: membership.userId, tenantId: membership.tenantId },
      dto,
      requestContext(req)
    );
    return { journalEntry: entry };
  }

  @Post("journal-entries/:id/cancel")
  @RequirePermission("accounting.journal.cancel")
  async cancelJournalEntry(
    @CurrentMembership() membership: MembershipWithRole,
    @Param("id") id: string,
    @Body() dto: CancelReasonDto,
    @Req() req: Request
  ): Promise<any> {
    return {
      journalEntry: await this.accountingService.cancelJournalEntry(
        { userId: membership.userId, tenantId: membership.tenantId },
        id,
        dto.reason,
        requestContext(req)
      )
    };
  }

  @Get("ledger/:accountId")
  @RequirePermission("accounting.ledger.view")
  async getGeneralLedger(
    @CurrentMembership() membership: MembershipWithRole,
    @Param("accountId") accountId: string,
    @Query("startDate") startDate?: string,
    @Query("endDate") endDate?: string,
    @Query("financialYearId") financialYearId?: string
  ): Promise<any> {
    return this.accountingService.getGeneralLedger(membership.tenantId, accountId, startDate, endDate, financialYearId);
  }

  @Get("cash-book")
  @RequirePermission("finance.view")
  async getCashBook(
    @CurrentMembership() membership: MembershipWithRole,
    @Query("startDate") startDate?: string,
    @Query("endDate") endDate?: string,
    @Query("financialYearId") financialYearId?: string
  ): Promise<any> {
    return this.accountingService.getCashBook(membership.tenantId, startDate, endDate, financialYearId);
  }

  @Get("bank-book/:bankAccountId")
  @RequirePermission("accounting.view")
  async getBankBook(
    @CurrentMembership() membership: MembershipWithRole,
    @Param("bankAccountId") bankAccountId: string,
    @Query("startDate") startDate?: string,
    @Query("endDate") endDate?: string
  ): Promise<any> {
    return this.accountingService.getBankBook(membership.tenantId, bankAccountId, startDate, endDate);
  }

  @Get("trial-balance")
  @RequirePermission("accounting.reports.view")
  async getTrialBalance(
    @CurrentMembership() membership: MembershipWithRole,
    @Query("financialYearId") financialYearId?: string,
    @Query("startDate") startDate?: string,
    @Query("endDate") endDate?: string
  ): Promise<any> {
    return this.accountingService.getTrialBalance(membership.tenantId, financialYearId, startDate, endDate);
  }

  @Get("receipt-payment")
  @RequirePermission("accounting.reports.view")
  async getReceiptAndPayment(
    @CurrentMembership() membership: MembershipWithRole,
    @Query("financialYearId") financialYearId?: string,
    @Query("startDate") startDate?: string,
    @Query("endDate") endDate?: string
  ): Promise<any> {
    return this.accountingService.getReceiptAndPaymentAccount(membership.tenantId, financialYearId, startDate, endDate);
  }

  @Get("income-expenditure")
  @RequirePermission("accounting.reports.view")
  async getIncomeAndExpenditure(
    @CurrentMembership() membership: MembershipWithRole,
    @Query("financialYearId") financialYearId?: string,
    @Query("startDate") startDate?: string,
    @Query("endDate") endDate?: string
  ): Promise<any> {
    return this.accountingService.getIncomeAndExpenditure(membership.tenantId, financialYearId, startDate, endDate);
  }

  @Get("balance-sheet")
  @RequirePermission("accounting.reports.view")
  async getBalanceSheet(
    @CurrentMembership() membership: MembershipWithRole,
    @Query("asOfDate") asOfDate?: string,
    @Query("financialYearId") financialYearId?: string
  ): Promise<any> {
    return this.accountingService.getBalanceSheet(membership.tenantId, asOfDate, financialYearId);
  }

  // =========================================================================
  // 4. Collections & Receipts
  // =========================================================================

  @Get("collections")
  @RequirePermission("collections.view")
  async listCollections(
    @CurrentMembership() membership: MembershipWithRole,
    @Query() query: PaginationQueryDto,
    @Query("type") type?: string,
    @Query("categoryId") categoryId?: string,
    @Query("familyId") familyId?: string,
    @Query("memberId") memberId?: string,
    @Query("divisionId") divisionId?: string,
    @Query("startDate") startDate?: string,
    @Query("endDate") endDate?: string,
    @Query("search") search?: string
  ): Promise<any> {
    const page = query.page ?? 1;
    const pageSize = query.pageSize ?? 20;
    const { collections, total } = await this.collectionsService.listCollections(membership.tenantId, {
      type,
      categoryId,
      familyId,
      memberId,
      divisionId,
      startDate,
      endDate,
      search,
      page,
      pageSize
    });
    return { collections, meta: { total, page, pageSize } };
  }

  @Get("collections/friday-summary")
  @RequirePermission("collections.view")
  async getFridaySummary(@CurrentMembership() membership: MembershipWithRole, @Query("date") date: string): Promise<any> {
    return this.collectionsService.getFridayCollectionSummary(membership.tenantId, date || new Date().toISOString().slice(0, 10));
  }

  @Get("collections/family/:familyId")
  @RequirePermission("collections.view")
  async getFamilyCollectionHistory(@CurrentMembership() membership: MembershipWithRole, @Param("familyId") familyId: string): Promise<any> {
    return this.collectionsService.getFamilyCollectionHistory(membership.tenantId, familyId);
  }

  @Get("collections/:id")
  @RequirePermission("collections.view")
  async getCollection(@CurrentMembership() membership: MembershipWithRole, @Param("id") id: string): Promise<any> {
    return { collection: await this.collectionsService.getCollection(membership.tenantId, id) };
  }

  @Post("collections")
  @RequirePermission("collections.create")
  async createCollection(
    @CurrentMembership() membership: MembershipWithRole,
    @Body() dto: CreateCollectionDto,
    @Req() req: Request
  ): Promise<any> {
    const collection = await this.collectionsService.createCollection(
      { userId: membership.userId, tenantId: membership.tenantId },
      dto,
      requestContext(req)
    );
    return { collection };
  }

  @Post("collections/:id/cancel")
  @RequirePermission("collections.cancel")
  async cancelCollection(
    @CurrentMembership() membership: MembershipWithRole,
    @Param("id") id: string,
    @Body() dto: CancelReasonDto,
    @Req() req: Request
  ): Promise<any> {
    return this.collectionsService.cancelCollection(
      { userId: membership.userId, tenantId: membership.tenantId },
      id,
      dto.reason,
      requestContext(req)
    );
  }

  @Get("receipts")
  @RequirePermission("receipts.view")
  async listReceipts(
    @CurrentMembership() membership: MembershipWithRole,
    @Query() query: PaginationQueryDto,
    @Query("search") search?: string
  ): Promise<any> {
    const page = query.page ?? 1;
    const pageSize = query.pageSize ?? 20;
    const { receipts, total } = await this.collectionsService.listReceipts(membership.tenantId, page, pageSize, search);
    return { receipts, meta: { total, page, pageSize } };
  }

  @Get("receipts/:id")
  @RequirePermission("receipts.view")
  async getReceipt(@CurrentMembership() membership: MembershipWithRole, @Param("id") id: string): Promise<any> {
    return { receipt: await this.collectionsService.getReceipt(membership.tenantId, id) };
  }

  @Post("receipts/:id/cancel")
  @RequirePermission("collections.cancel")
  async cancelReceipt(
    @CurrentMembership() membership: MembershipWithRole,
    @Param("id") id: string,
    @Body() dto: CancelReasonDto,
    @Req() req: Request
  ): Promise<any> {
    return this.collectionsService.cancelReceipt(
      { userId: membership.userId, tenantId: membership.tenantId },
      id,
      dto.reason,
      requestContext(req)
    );
  }

  // =========================================================================
  // 5. Expenses & Vouchers
  // =========================================================================

  @Get("vouchers")
  @RequirePermission("expenses.view")
  async listVouchers(
    @CurrentMembership() membership: MembershipWithRole,
    @Query() query: PaginationQueryDto,
    @Query("type") type?: "RECEIPT" | "PAYMENT",
    @Query("voucherSubtype") voucherSubtype?: string,
    @Query("status") status?: string,
    @Query("expenseCategoryId") expenseCategoryId?: string,
    @Query("startDate") startDate?: string,
    @Query("endDate") endDate?: string,
    @Query("search") search?: string
  ): Promise<any> {
    const page = query.page ?? 1;
    const pageSize = query.pageSize ?? 20;
    const { vouchers, total } = await this.expensesService.listVouchers(membership.tenantId, {
      type,
      voucherSubtype,
      status,
      expenseCategoryId,
      startDate,
      endDate,
      search,
      page,
      pageSize
    });
    return { vouchers, meta: { total, page, pageSize } };
  }

  @Get("vouchers/:id")
  @RequirePermission("expenses.view")
  async getVoucher(@CurrentMembership() membership: MembershipWithRole, @Param("id") id: string): Promise<any> {
    return { voucher: await this.expensesService.findVoucherOrThrow(membership.tenantId, id) };
  }

  @Post("vouchers")
  @RequirePermission("expenses.create")
  async createVoucher(@CurrentMembership() membership: MembershipWithRole, @Body() dto: CreateVoucherDto, @Req() req: Request): Promise<any> {
    const voucher = await this.expensesService.createVoucher(
      { userId: membership.userId, tenantId: membership.tenantId },
      dto,
      requestContext(req)
    );
    return { voucher };
  }

  @Patch("vouchers/:id")
  @RequirePermission("expenses.update")
  async updateVoucher(
    @CurrentMembership() membership: MembershipWithRole,
    @Param("id") id: string,
    @Body() dto: UpdateVoucherDto,
    @Req() req: Request
  ): Promise<any> {
    const voucher = await this.expensesService.updateVoucher(
      { userId: membership.userId, tenantId: membership.tenantId },
      id,
      dto,
      requestContext(req)
    );
    return { voucher };
  }

  @Post("vouchers/:id/submit")
  @RequirePermission("expenses.update")
  async submitVoucher(@CurrentMembership() membership: MembershipWithRole, @Param("id") id: string, @Req() req: Request): Promise<any> {
    return { voucher: await this.expensesService.submitVoucher({ userId: membership.userId, tenantId: membership.tenantId }, id, requestContext(req)) };
  }

  @Post("vouchers/:id/approve")
  @RequirePermission("expenses.approve")
  async approveVoucher(@CurrentMembership() membership: MembershipWithRole, @Param("id") id: string, @Req() req: Request): Promise<any> {
    return { voucher: await this.expensesService.approveVoucher({ userId: membership.userId, tenantId: membership.tenantId }, id, requestContext(req)) };
  }

  @Post("vouchers/:id/pay")
  @RequirePermission("payments.create")
  async payVoucher(
    @CurrentMembership() membership: MembershipWithRole,
    @Param("id") id: string,
    @Body() body: { paymentMethod?: string; bankAccountId?: string },
    @Req() req: Request
  ): Promise<any> {
    return {
      voucher: await this.expensesService.payVoucher(
        { userId: membership.userId, tenantId: membership.tenantId },
        id,
        body,
        requestContext(req)
      )
    };
  }

  @Post("vouchers/:id/cancel")
  @RequirePermission("expenses.cancel")
  async cancelVoucher(
    @CurrentMembership() membership: MembershipWithRole,
    @Param("id") id: string,
    @Body() dto: CancelReasonDto,
    @Req() req: Request
  ): Promise<any> {
    return this.expensesService.cancelVoucher(
      { userId: membership.userId, tenantId: membership.tenantId },
      id,
      dto.reason,
      requestContext(req)
    );
  }

  // =========================================================================
  // 6. Dues & Arrears
  // =========================================================================

  @Get("dues")
  @RequirePermission("dues.view")
  async listDues(
    @CurrentMembership() membership: MembershipWithRole,
    @Query() query: PaginationQueryDto,
    @Query("status") status?: "PENDING" | "PAID" | "WAIVED",
    @Query("familyId") familyId?: string,
    @Query("memberId") memberId?: string,
    @Query("divisionId") divisionId?: string,
    @Query("categoryId") categoryId?: string,
    @Query("period") period?: string
  ): Promise<any> {
    const page = query.page ?? 1;
    const pageSize = query.pageSize ?? 20;
    const { dues, total } = await this.duesService.listDues(membership.tenantId, {
      status,
      familyId,
      memberId,
      divisionId,
      categoryId,
      period,
      page,
      pageSize
    });
    return { dues, meta: { total, page, pageSize } };
  }

  @Get("dues/summary")
  @RequirePermission("dues.view")
  async getDuesSummary(@CurrentMembership() membership: MembershipWithRole): Promise<any> {
    return this.duesService.getDuesSummary(membership.tenantId);
  }

  @Post("dues")
  @RequirePermission("dues.manage")
  async createDue(@CurrentMembership() membership: MembershipWithRole, @Body() dto: CreateDueDto, @Req() req: Request): Promise<any> {
    const due = await this.duesService.createDue({ userId: membership.userId, tenantId: membership.tenantId }, dto, requestContext(req));
    return { due };
  }

  @Patch("dues/:id")
  @RequirePermission("dues.manage")
  async updateDue(
    @CurrentMembership() membership: MembershipWithRole,
    @Param("id") id: string,
    @Body() dto: UpdateDueDto,
    @Req() req: Request
  ): Promise<any> {
    const due = await this.duesService.updateDue({ userId: membership.userId, tenantId: membership.tenantId }, id, dto, requestContext(req));
    return { due };
  }

  @Post("dues/:id/pay")
  @RequirePermission("collections.create")
  async markDuePaid(
    @CurrentMembership() membership: MembershipWithRole,
    @Param("id") id: string,
    @Body() dto: MarkDuePaidDto,
    @Req() req: Request
  ): Promise<any> {
    const due = await this.duesService.markDuePaid({ userId: membership.userId, tenantId: membership.tenantId }, id, dto, requestContext(req));
    return { due };
  }

  @Delete("dues/:id")
  @RequirePermission("dues.manage")
  async removeDue(@CurrentMembership() membership: MembershipWithRole, @Param("id") id: string, @Req() req: Request): Promise<any> {
    await this.duesService.removeDue({ userId: membership.userId, tenantId: membership.tenantId }, id, requestContext(req));
    return { success: true };
  }

  // =========================================================================
  // 7. Salary Register
  // =========================================================================

  @Get("salary")
  @RequirePermission("salary.view")
  async listSalary(
    @CurrentMembership() membership: MembershipWithRole,
    @Query() query: PaginationQueryDto,
    @Query("month") month?: string,
    @Query("status") status?: string
  ): Promise<any> {
    const page = query.page ?? 1;
    const pageSize = query.pageSize ?? 20;
    const { records, total } = await this.salaryService.listSalaryRecords(membership.tenantId, page, pageSize, month, status);
    return { records, meta: { total, page, pageSize } };
  }

  @Get("salary/summary")
  @RequirePermission("salary.view")
  async getSalarySummary(@CurrentMembership() membership: MembershipWithRole, @Query("month") month?: string): Promise<any> {
    return this.salaryService.getSalarySummary(membership.tenantId, month);
  }

  @Post("salary")
  @RequirePermission("salary.create")
  async createSalary(@CurrentMembership() membership: MembershipWithRole, @Body() dto: CreateSalaryRecordDto, @Req() req: Request): Promise<any> {
    const record = await this.salaryService.createSalaryRecord(
      { userId: membership.userId, tenantId: membership.tenantId },
      dto,
      requestContext(req)
    );
    return { record };
  }

  @Post("salary/:id/approve")
  @RequirePermission("salary.approve")
  async approveSalary(@CurrentMembership() membership: MembershipWithRole, @Param("id") id: string, @Req() req: Request): Promise<any> {
    return {
      record: await this.salaryService.approveSalaryRecord(
        { userId: membership.userId, tenantId: membership.tenantId },
        id,
        requestContext(req)
      )
    };
  }

  @Post("salary/:id/pay")
  @RequirePermission("salary.pay")
  async markSalaryPaid(
    @CurrentMembership() membership: MembershipWithRole,
    @Param("id") id: string,
    @Body() dto: MarkSalaryPaidDto,
    @Req() req: Request
  ): Promise<any> {
    const record = await this.salaryService.markSalaryPaid(
      { userId: membership.userId, tenantId: membership.tenantId },
      id,
      dto,
      requestContext(req)
    );
    return { record };
  }

  @Delete("salary/:id")
  @RequirePermission("salary.update")
  async removeSalary(@CurrentMembership() membership: MembershipWithRole, @Param("id") id: string, @Req() req: Request): Promise<any> {
    await this.salaryService.removeSalaryRecord({ userId: membership.userId, tenantId: membership.tenantId }, id, requestContext(req));
    return { success: true };
  }

  // =========================================================================
  // 8. Interest-Free Banking
  // =========================================================================

  @Get("interest-free/accounts")
  @RequirePermission("banking.view")
  async listInterestFreeAccounts(
    @CurrentMembership() membership: MembershipWithRole,
    @Query() query: PaginationQueryDto,
    @Query("search") search?: string
  ): Promise<any> {
    const page = query.page ?? 1;
    const pageSize = query.pageSize ?? 20;
    const { accounts, total } = await this.interestFreeService.listAccounts(membership.tenantId, page, pageSize, search);
    return { accounts, meta: { total, page, pageSize } };
  }

  @Get("interest-free/accounts/:id")
  @RequirePermission("banking.view")
  async getInterestFreeAccount(@CurrentMembership() membership: MembershipWithRole, @Param("id") id: string): Promise<any> {
    return { account: await this.interestFreeService.getAccount(membership.tenantId, id) };
  }

  @Post("interest-free/accounts")
  @RequirePermission("banking.manage")
  async createInterestFreeAccount(
    @CurrentMembership() membership: MembershipWithRole,
    @Body() dto: CreateInterestFreeAccountDto,
    @Req() req: Request
  ): Promise<any> {
    const account = await this.interestFreeService.createAccount(
      { userId: membership.userId, tenantId: membership.tenantId },
      dto,
      requestContext(req)
    );
    return { account };
  }

  @Post("interest-free/transactions")
  @RequirePermission("banking.manage")
  async createInterestFreeTransaction(
    @CurrentMembership() membership: MembershipWithRole,
    @Body() dto: CreateInterestFreeTransactionDto,
    @Req() req: Request
  ): Promise<any> {
    const transaction = await this.interestFreeService.recordTransaction(
      { userId: membership.userId, tenantId: membership.tenantId },
      dto,
      requestContext(req)
    );
    return { transaction };
  }

  // =========================================================================
  // 9. Taxes & Legal Filings
  // =========================================================================

  @Get("taxes-legal")
  @RequirePermission("taxes.view")
  async listTaxLegalFilings(@CurrentMembership() membership: MembershipWithRole, @Query("status") status?: string): Promise<any> {
    return { filings: await this.taxesLegalService.listFilings(membership.tenantId, status) };
  }

  @Post("taxes-legal")
  @RequirePermission("taxes.manage")
  async createTaxLegalFiling(
    @CurrentMembership() membership: MembershipWithRole,
    @Body() dto: CreateTaxLegalFilingDto,
    @Req() req: Request
  ): Promise<any> {
    const filing = await this.taxesLegalService.createFiling(
      { userId: membership.userId, tenantId: membership.tenantId },
      dto,
      requestContext(req)
    );
    return { filing };
  }

  @Patch("taxes-legal/:id")
  @RequirePermission("taxes.manage")
  async updateTaxLegalFiling(
    @CurrentMembership() membership: MembershipWithRole,
    @Param("id") id: string,
    @Body() dto: UpdateTaxLegalFilingDto,
    @Req() req: Request
  ): Promise<any> {
    const filing = await this.taxesLegalService.updateFiling(
      { userId: membership.userId, tenantId: membership.tenantId },
      id,
      dto,
      requestContext(req)
    );
    return { filing };
  }

  @Delete("taxes-legal/:id")
  @RequirePermission("taxes.manage")
  async removeTaxLegalFiling(@CurrentMembership() membership: MembershipWithRole, @Param("id") id: string, @Req() req: Request): Promise<any> {
    await this.taxesLegalService.removeFiling({ userId: membership.userId, tenantId: membership.tenantId }, id, requestContext(req));
    return { success: true };
  }

  // =========================================================================
  // 10. Settings Hub (Payment Methods, Bank Accounts, Categories, General)
  // =========================================================================

  @Get("settings")
  @RequirePermission("finance.settings.view")
  async getSettings(@CurrentMembership() membership: MembershipWithRole): Promise<any> {
    return { settings: await this.settingsService.getSettings(membership.tenantId) };
  }

  @Patch("settings")
  @RequirePermission("finance.settings.update")
  async updateSettings(
    @CurrentMembership() membership: MembershipWithRole,
    @Body() dto: UpdateFinanceSettingsDto,
    @Req() req: Request
  ): Promise<any> {
    const settings = await this.settingsService.updateSettings(
      { userId: membership.userId, tenantId: membership.tenantId },
      dto,
      requestContext(req)
    );
    return { settings };
  }

  @Get("settings/payment-methods")
  @RequirePermission("finance.settings.view")
  async listPaymentMethods(@CurrentMembership() membership: MembershipWithRole): Promise<any> {
    return { paymentMethods: await this.settingsService.listPaymentMethods(membership.tenantId) };
  }

  @Post("settings/payment-methods")
  @RequirePermission("finance.settings.update")
  async createPaymentMethod(
    @CurrentMembership() membership: MembershipWithRole,
    @Body() dto: CreatePaymentMethodDto,
    @Req() req: Request
  ): Promise<any> {
    return {
      paymentMethod: await this.settingsService.createPaymentMethod(
        { userId: membership.userId, tenantId: membership.tenantId },
        dto,
        requestContext(req)
      )
    };
  }

  @Patch("settings/payment-methods/:id")
  @RequirePermission("finance.settings.update")
  async updatePaymentMethod(
    @CurrentMembership() membership: MembershipWithRole,
    @Param("id") id: string,
    @Body() dto: UpdatePaymentMethodDto,
    @Req() req: Request
  ): Promise<any> {
    return {
      paymentMethod: await this.settingsService.updatePaymentMethod(
        { userId: membership.userId, tenantId: membership.tenantId },
        id,
        dto,
        requestContext(req)
      )
    };
  }

  @Delete("settings/payment-methods/:id")
  @RequirePermission("finance.settings.update")
  async removePaymentMethod(@CurrentMembership() membership: MembershipWithRole, @Param("id") id: string, @Req() req: Request): Promise<any> {
    await this.settingsService.removePaymentMethod({ userId: membership.userId, tenantId: membership.tenantId }, id, requestContext(req));
    return { success: true };
  }

  @Get("settings/bank-accounts")
  @RequirePermission("finance.settings.view")
  async listBankAccounts(@CurrentMembership() membership: MembershipWithRole): Promise<any> {
    return { bankAccounts: await this.settingsService.listBankAccounts(membership.tenantId) };
  }

  @Post("settings/bank-accounts")
  @RequirePermission("finance.settings.update")
  async createBankAccount(
    @CurrentMembership() membership: MembershipWithRole,
    @Body() dto: CreateBankAccountDto,
    @Req() req: Request
  ): Promise<any> {
    return {
      bankAccount: await this.settingsService.createBankAccount(
        { userId: membership.userId, tenantId: membership.tenantId },
        dto,
        requestContext(req)
      )
    };
  }

  @Patch("settings/bank-accounts/:id")
  @RequirePermission("finance.settings.update")
  async updateBankAccount(
    @CurrentMembership() membership: MembershipWithRole,
    @Param("id") id: string,
    @Body() dto: UpdateBankAccountDto,
    @Req() req: Request
  ): Promise<any> {
    return {
      bankAccount: await this.settingsService.updateBankAccount(
        { userId: membership.userId, tenantId: membership.tenantId },
        id,
        dto,
        requestContext(req)
      )
    };
  }

  @Delete("settings/bank-accounts/:id")
  @RequirePermission("finance.settings.update")
  async removeBankAccount(@CurrentMembership() membership: MembershipWithRole, @Param("id") id: string, @Req() req: Request): Promise<any> {
    await this.settingsService.removeBankAccount({ userId: membership.userId, tenantId: membership.tenantId }, id, requestContext(req));
    return { success: true };
  }

  @Get("settings/collection-categories")
  @RequirePermission("finance.settings.view")
  async listCollectionCategories(@CurrentMembership() membership: MembershipWithRole): Promise<any> {
    return { categories: await this.settingsService.listCollectionCategories(membership.tenantId) };
  }

  @Post("settings/collection-categories")
  @RequirePermission("finance.settings.update")
  async createCollectionCategory(
    @CurrentMembership() membership: MembershipWithRole,
    @Body() dto: CreateCollectionCategoryDto,
    @Req() req: Request
  ): Promise<any> {
    return {
      category: await this.settingsService.createCollectionCategory(
        { userId: membership.userId, tenantId: membership.tenantId },
        dto,
        requestContext(req)
      )
    };
  }

  @Patch("settings/collection-categories/:id")
  @RequirePermission("finance.settings.update")
  async updateCollectionCategory(
    @CurrentMembership() membership: MembershipWithRole,
    @Param("id") id: string,
    @Body() dto: UpdateCollectionCategoryDto,
    @Req() req: Request
  ): Promise<any> {
    return {
      category: await this.settingsService.updateCollectionCategory(
        { userId: membership.userId, tenantId: membership.tenantId },
        id,
        dto,
        requestContext(req)
      )
    };
  }

  @Delete("settings/collection-categories/:id")
  @RequirePermission("finance.settings.update")
  async removeCollectionCategory(@CurrentMembership() membership: MembershipWithRole, @Param("id") id: string, @Req() req: Request): Promise<any> {
    await this.settingsService.removeCollectionCategory({ userId: membership.userId, tenantId: membership.tenantId }, id, requestContext(req));
    return { success: true };
  }

  @Get("settings/expense-categories")
  @RequirePermission("finance.settings.view")
  async listExpenseCategories(@CurrentMembership() membership: MembershipWithRole): Promise<any> {
    return { categories: await this.settingsService.listExpenseCategories(membership.tenantId) };
  }

  @Post("settings/expense-categories")
  @RequirePermission("finance.settings.update")
  async createExpenseCategory(
    @CurrentMembership() membership: MembershipWithRole,
    @Body() dto: CreateExpenseCategoryDto,
    @Req() req: Request
  ): Promise<any> {
    return {
      category: await this.settingsService.createExpenseCategory(
        { userId: membership.userId, tenantId: membership.tenantId },
        dto,
        requestContext(req)
      )
    };
  }

  @Patch("settings/expense-categories/:id")
  @RequirePermission("finance.settings.update")
  async updateExpenseCategory(
    @CurrentMembership() membership: MembershipWithRole,
    @Param("id") id: string,
    @Body() dto: UpdateExpenseCategoryDto,
    @Req() req: Request
  ): Promise<any> {
    return {
      category: await this.settingsService.updateExpenseCategory(
        { userId: membership.userId, tenantId: membership.tenantId },
        id,
        dto,
        requestContext(req)
      )
    };
  }

  @Delete("settings/expense-categories/:id")
  @RequirePermission("finance.settings.update")
  async removeExpenseCategory(@CurrentMembership() membership: MembershipWithRole, @Param("id") id: string, @Req() req: Request): Promise<any> {
    await this.settingsService.removeExpenseCategory({ userId: membership.userId, tenantId: membership.tenantId }, id, requestContext(req));
    return { success: true };
  }

  // =========================================================================
  // 11. Finance Reports
  // =========================================================================

  @Get("reports/collections")
  @RequirePermission("reports.view")
  async getCollectionReport(
    @CurrentMembership() membership: MembershipWithRole,
    @Query("startDate") startDate?: string,
    @Query("endDate") endDate?: string,
    @Query("categoryId") categoryId?: string,
    @Query("divisionId") divisionId?: string,
    @Query("paymentMethodId") paymentMethodId?: string
  ): Promise<any> {
    return this.reportsService.getCollectionReport(membership.tenantId, {
      startDate,
      endDate,
      categoryId,
      divisionId,
      paymentMethodId
    });
  }

  @Get("reports/expenses")
  @RequirePermission("reports.view")
  async getExpenseReport(
    @CurrentMembership() membership: MembershipWithRole,
    @Query("startDate") startDate?: string,
    @Query("endDate") endDate?: string,
    @Query("expenseCategoryId") expenseCategoryId?: string,
    @Query("bankAccountId") bankAccountId?: string
  ): Promise<any> {
    return this.reportsService.getExpenseReport(membership.tenantId, {
      startDate,
      endDate,
      expenseCategoryId,
      bankAccountId
    });
  }

  @Get("reports/dues")
  @RequirePermission("reports.view")
  async getDuesReport(
    @CurrentMembership() membership: MembershipWithRole,
    @Query("divisionId") divisionId?: string,
    @Query("categoryId") categoryId?: string,
    @Query("status") status?: "PENDING" | "PAID"
  ): Promise<any> {
    return this.reportsService.getDuesReport(membership.tenantId, { divisionId, categoryId, status });
  }

  @Get("reports/area-analysis")
  @RequirePermission("reports.view")
  async getAreaWiseFinance(@CurrentMembership() membership: MembershipWithRole): Promise<any> {
    return { areas: await this.reportsService.getAreaWiseFinance(membership.tenantId) };
  }
}
