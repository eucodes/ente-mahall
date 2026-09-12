import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Query, Req, UseGuards } from "@nestjs/common";
import type { Request } from "express";
import type { Due, SalaryRecord } from "@mahalle/database";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { TenantContextGuard } from "../tenants/guards/tenant-context.guard";
import { PermissionGuard } from "../tenants/guards/permission.guard";
import { RequirePermission } from "../common/decorators/require-permission.decorator";
import { CurrentMembership } from "../tenants/decorators/current-membership.decorator";
import type { MembershipWithRole } from "../memberships/memberships.service";
import { PaginationQueryDto } from "../common/dto/pagination-query.dto";
import { FinanceService, type VoucherWithDetail } from "./finance.service";
import { CreateAccountDto } from "./dto/create-account.dto";
import { UpdateAccountDto } from "./dto/update-account.dto";
import { CreateVoucherDto } from "./dto/create-voucher.dto";
import { UpdateVoucherDto } from "./dto/update-voucher.dto";
import { CreateDueDto } from "./dto/create-due.dto";
import { UpdateDueDto } from "./dto/update-due.dto";
import { MarkDuePaidDto } from "./dto/mark-due-paid.dto";
import { CreateSalaryRecordDto } from "./dto/create-salary-record.dto";
import { MarkSalaryPaidDto } from "./dto/mark-salary-paid.dto";

function requestContext(req: Request) {
  return { ipAddress: req.ip, userAgent: req.headers["user-agent"] };
}

@Controller("tenants/:slug/finance")
@UseGuards(JwtAuthGuard, TenantContextGuard, PermissionGuard)
export class FinanceController {
  constructor(private readonly financeService: FinanceService) {}

  // Accounts
  @Get("accounts")
  @RequirePermission("finance.view")
  async listAccounts(@CurrentMembership() membership: MembershipWithRole) {
    return { accounts: await this.financeService.listAccounts(membership.tenantId) };
  }

  @Post("accounts")
  @RequirePermission("finance.create")
  async createAccount(@CurrentMembership() membership: MembershipWithRole, @Body() dto: CreateAccountDto, @Req() req: Request) {
    const account = await this.financeService.createAccount({ userId: membership.userId, tenantId: membership.tenantId }, dto, requestContext(req));
    return { account };
  }

  @Patch("accounts/:id")
  @RequirePermission("finance.update")
  @HttpCode(HttpStatus.OK)
  async updateAccount(@CurrentMembership() membership: MembershipWithRole, @Param("id") id: string, @Body() dto: UpdateAccountDto, @Req() req: Request) {
    const account = await this.financeService.updateAccount({ userId: membership.userId, tenantId: membership.tenantId }, id, dto, requestContext(req));
    return { account };
  }

  @Delete("accounts/:id")
  @RequirePermission("finance.delete")
  @HttpCode(HttpStatus.OK)
  async removeAccount(@CurrentMembership() membership: MembershipWithRole, @Param("id") id: string, @Req() req: Request) {
    await this.financeService.removeAccount({ userId: membership.userId, tenantId: membership.tenantId }, id, requestContext(req));
    return { success: true };
  }

  // Vouchers
  @Get("vouchers")
  @RequirePermission("finance.view")
  async listVouchers(
    @CurrentMembership() membership: MembershipWithRole,
    @Query() query: PaginationQueryDto
  ): Promise<{ vouchers: VoucherWithDetail[]; meta: { page: number; pageSize: number; total: number } }> {
    const { vouchers, total } = await this.financeService.listVouchers(membership.tenantId, query.page, query.pageSize);
    return { vouchers, meta: { page: query.page, pageSize: query.pageSize, total } };
  }

  @Post("vouchers")
  @RequirePermission("finance.create")
  async createVoucher(
    @CurrentMembership() membership: MembershipWithRole,
    @Body() dto: CreateVoucherDto,
    @Req() req: Request
  ): Promise<{ voucher: VoucherWithDetail }> {
    const voucher = await this.financeService.createVoucher({ userId: membership.userId, tenantId: membership.tenantId }, dto, requestContext(req));
    return { voucher };
  }

  @Patch("vouchers/:id")
  @RequirePermission("finance.update")
  @HttpCode(HttpStatus.OK)
  async updateVoucher(
    @CurrentMembership() membership: MembershipWithRole,
    @Param("id") id: string,
    @Body() dto: UpdateVoucherDto,
    @Req() req: Request
  ): Promise<{ voucher: VoucherWithDetail }> {
    const voucher = await this.financeService.updateVoucher({ userId: membership.userId, tenantId: membership.tenantId }, id, dto, requestContext(req));
    return { voucher };
  }

  @Delete("vouchers/:id")
  @RequirePermission("finance.delete")
  @HttpCode(HttpStatus.OK)
  async removeVoucher(@CurrentMembership() membership: MembershipWithRole, @Param("id") id: string, @Req() req: Request) {
    await this.financeService.removeVoucher({ userId: membership.userId, tenantId: membership.tenantId }, id, requestContext(req));
    return { success: true };
  }

  // Dues
  @Get("dues")
  @RequirePermission("finance.view")
  async listDues(
    @CurrentMembership() membership: MembershipWithRole,
    @Query() query: PaginationQueryDto
  ): Promise<{ dues: unknown[]; meta: { page: number; pageSize: number; total: number } }> {
    const { dues, total } = await this.financeService.listDues(membership.tenantId, query.page, query.pageSize);
    return { dues, meta: { page: query.page, pageSize: query.pageSize, total } };
  }

  @Post("dues")
  @RequirePermission("finance.create")
  async createDue(@CurrentMembership() membership: MembershipWithRole, @Body() dto: CreateDueDto, @Req() req: Request): Promise<{ due: Due }> {
    const due = await this.financeService.createDue({ userId: membership.userId, tenantId: membership.tenantId }, dto, requestContext(req));
    return { due };
  }

  @Patch("dues/:id")
  @RequirePermission("finance.update")
  @HttpCode(HttpStatus.OK)
  async updateDue(
    @CurrentMembership() membership: MembershipWithRole,
    @Param("id") id: string,
    @Body() dto: UpdateDueDto,
    @Req() req: Request
  ): Promise<{ due: Due }> {
    const due = await this.financeService.updateDue({ userId: membership.userId, tenantId: membership.tenantId }, id, dto, requestContext(req));
    return { due };
  }

  @Post("dues/:id/pay")
  @RequirePermission("finance.update")
  async markDuePaid(
    @CurrentMembership() membership: MembershipWithRole,
    @Param("id") id: string,
    @Body() dto: MarkDuePaidDto,
    @Req() req: Request
  ): Promise<{ due: Due }> {
    const due = await this.financeService.markDuePaid({ userId: membership.userId, tenantId: membership.tenantId }, id, dto, requestContext(req));
    return { due };
  }

  @Delete("dues/:id")
  @RequirePermission("finance.delete")
  @HttpCode(HttpStatus.OK)
  async removeDue(@CurrentMembership() membership: MembershipWithRole, @Param("id") id: string, @Req() req: Request) {
    await this.financeService.removeDue({ userId: membership.userId, tenantId: membership.tenantId }, id, requestContext(req));
    return { success: true };
  }

  // Salary
  @Get("salary")
  @RequirePermission("finance.view")
  async listSalaryRecords(
    @CurrentMembership() membership: MembershipWithRole,
    @Query() query: PaginationQueryDto
  ): Promise<{ records: SalaryRecord[]; meta: { page: number; pageSize: number; total: number } }> {
    const { records, total } = await this.financeService.listSalaryRecords(membership.tenantId, query.page, query.pageSize);
    return { records, meta: { page: query.page, pageSize: query.pageSize, total } };
  }

  @Post("salary")
  @RequirePermission("finance.create")
  async createSalaryRecord(
    @CurrentMembership() membership: MembershipWithRole,
    @Body() dto: CreateSalaryRecordDto,
    @Req() req: Request
  ): Promise<{ record: SalaryRecord }> {
    const record = await this.financeService.createSalaryRecord({ userId: membership.userId, tenantId: membership.tenantId }, dto, requestContext(req));
    return { record };
  }

  @Post("salary/:id/pay")
  @RequirePermission("finance.update")
  async markSalaryPaid(
    @CurrentMembership() membership: MembershipWithRole,
    @Param("id") id: string,
    @Body() dto: MarkSalaryPaidDto,
    @Req() req: Request
  ): Promise<{ record: SalaryRecord }> {
    const record = await this.financeService.markSalaryPaid({ userId: membership.userId, tenantId: membership.tenantId }, id, dto, requestContext(req));
    return { record };
  }

  @Delete("salary/:id")
  @RequirePermission("finance.delete")
  @HttpCode(HttpStatus.OK)
  async removeSalaryRecord(@CurrentMembership() membership: MembershipWithRole, @Param("id") id: string, @Req() req: Request) {
    await this.financeService.removeSalaryRecord({ userId: membership.userId, tenantId: membership.tenantId }, id, requestContext(req));
    return { success: true };
  }

  // Reports
  @Get("reports/cash-book")
  @RequirePermission("finance.view")
  async cashBook(@CurrentMembership() membership: MembershipWithRole): Promise<{ rows: { voucher: VoucherWithDetail; balance: string }[]; closingBalance: string }> {
    return this.financeService.cashBook(membership.tenantId);
  }

  @Get("reports/summary")
  @RequirePermission("finance.view")
  async summary(@CurrentMembership() membership: MembershipWithRole) {
    return this.financeService.summary(membership.tenantId);
  }
}
