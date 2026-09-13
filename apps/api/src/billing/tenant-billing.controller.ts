import { Body, Controller, Get, HttpCode, HttpStatus, Param, Patch, Post, Req, UseGuards } from "@nestjs/common";
import type { Request } from "express";
import type { PlatformMembership } from "@mahalle/database";
import { PlatformRole } from "@mahalle/types";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { PlatformContextGuard } from "../platform/guards/platform-context.guard";
import { CurrentPlatformMembership } from "../platform/decorators/current-platform-membership.decorator";
import { RequirePlatformRole } from "../common/decorators/require-platform-role.decorator";
import { BillingService } from "./billing.service";
import { SetSubscriptionDto } from "./dto/set-subscription.dto";
import { UpdateSubscriptionStatusDto } from "./dto/update-subscription-status.dto";
import { CreateInvoiceDto } from "./dto/create-invoice.dto";
import { RecordPaymentDto } from "./dto/record-payment.dto";

function requestContext(req: Request) {
  return { ipAddress: req.ip, userAgent: req.headers["user-agent"] };
}

@Controller("platform/tenants/:tenantId/billing")
@UseGuards(JwtAuthGuard, PlatformContextGuard)
export class TenantBillingController {
  constructor(private readonly billingService: BillingService) {}

  @Get("subscription")
  async getSubscription(@Param("tenantId") tenantId: string) {
    const subscription = await this.billingService.getTenantSubscription(tenantId);
    return { subscription };
  }

  @Patch("subscription")
  @RequirePlatformRole(PlatformRole.SUPER_ADMIN)
  @HttpCode(HttpStatus.OK)
  async setSubscription(
    @Param("tenantId") tenantId: string,
    @Body() dto: SetSubscriptionDto,
    @CurrentPlatformMembership() membership: PlatformMembership,
    @Req() req: Request
  ) {
    const subscription = await this.billingService.setTenantSubscription(tenantId, dto, membership.userId, requestContext(req));
    return { subscription };
  }

  @Patch("subscription/status")
  @RequirePlatformRole(PlatformRole.SUPER_ADMIN)
  @HttpCode(HttpStatus.OK)
  async setSubscriptionStatus(
    @Param("tenantId") tenantId: string,
    @Body() dto: UpdateSubscriptionStatusDto,
    @CurrentPlatformMembership() membership: PlatformMembership,
    @Req() req: Request
  ) {
    const subscription = await this.billingService.updateSubscriptionStatus(
      tenantId,
      dto.status,
      membership.userId,
      requestContext(req)
    );
    return { subscription };
  }

  @Get("invoices")
  async listInvoices(@Param("tenantId") tenantId: string) {
    const invoices = await this.billingService.listInvoices(tenantId);
    return { invoices };
  }

  @Post("invoices")
  @RequirePlatformRole(PlatformRole.SUPER_ADMIN)
  async createInvoice(
    @Param("tenantId") tenantId: string,
    @Body() dto: CreateInvoiceDto,
    @CurrentPlatformMembership() membership: PlatformMembership,
    @Req() req: Request
  ) {
    const invoice = await this.billingService.createInvoice(tenantId, dto, membership.userId, requestContext(req));
    return { invoice };
  }

  @Post("invoices/:invoiceId/mark-paid")
  @RequirePlatformRole(PlatformRole.SUPER_ADMIN)
  @HttpCode(HttpStatus.OK)
  async markInvoicePaid(
    @Param("invoiceId") invoiceId: string,
    @CurrentPlatformMembership() membership: PlatformMembership,
    @Req() req: Request
  ) {
    const invoice = await this.billingService.markInvoicePaid(invoiceId, membership.userId, requestContext(req));
    return { invoice };
  }

  @Post("invoices/:invoiceId/void")
  @RequirePlatformRole(PlatformRole.SUPER_ADMIN)
  @HttpCode(HttpStatus.OK)
  async voidInvoice(
    @Param("invoiceId") invoiceId: string,
    @CurrentPlatformMembership() membership: PlatformMembership,
    @Req() req: Request
  ) {
    const invoice = await this.billingService.voidInvoice(invoiceId, membership.userId, requestContext(req));
    return { invoice };
  }

  @Get("payments")
  async listPayments(@Param("tenantId") tenantId: string) {
    const payments = await this.billingService.listPayments(tenantId);
    return { payments };
  }

  @Post("payments")
  @RequirePlatformRole(PlatformRole.SUPER_ADMIN)
  async recordPayment(
    @Param("tenantId") tenantId: string,
    @Body() dto: RecordPaymentDto,
    @CurrentPlatformMembership() membership: PlatformMembership,
    @Req() req: Request
  ) {
    const payment = await this.billingService.recordPayment(tenantId, dto, membership.userId, requestContext(req));
    return { payment };
  }
}
