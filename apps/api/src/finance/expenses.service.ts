import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { Prisma, type Voucher } from "@mahalle/database";
import { PrismaService } from "../database/prisma.service";
import { AuditService } from "../audit/audit.service";
import { CertificateService } from "../registers/certificates/certificate.service";
import { FinanceSettingsService } from "./finance-settings.service";
import { AccountingService } from "./accounting.service";
import type { CreateVoucherDto } from "./dto/create-voucher.dto";
import type { UpdateVoucherDto } from "./dto/update-voucher.dto";

interface RequestContext {
  ipAddress?: string;
  userAgent?: string;
}

interface ActorContext {
  userId: string;
  tenantId: string;
}

const VOUCHER_INCLUDE = {
  account: true,
  member: { select: { id: true, fullName: true } },
  expenseCategory: true,
  bankAccount: true,
  journalEntry: true
} as const;

@Injectable()
export class ExpensesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
    private readonly certificates: CertificateService,
    private readonly settingsService: FinanceSettingsService,
    private readonly accountingService: AccountingService
  ) {}

  async listVouchers(
    tenantId: string,
    params: {
      type?: "RECEIPT" | "PAYMENT";
      voucherSubtype?: string;
      status?: string;
      expenseCategoryId?: string;
      startDate?: string;
      endDate?: string;
      search?: string;
      page?: number;
      pageSize?: number;
    }
  ) {
    const page = params.page ?? 1;
    const pageSize = params.pageSize ?? 20;

    const where: Prisma.VoucherWhereInput = {
      tenantId,
      ...(params.type ? { type: params.type } : {}),
      ...(params.voucherSubtype ? { voucherSubtype: params.voucherSubtype } : {}),
      ...(params.status ? { status: params.status } : {}),
      ...(params.expenseCategoryId ? { expenseCategoryId: params.expenseCategoryId } : {}),
      ...(params.startDate || params.endDate
        ? {
            date: {
              gte: params.startDate ? new Date(params.startDate) : undefined,
              lte: params.endDate ? new Date(params.endDate) : undefined
            }
          }
        : {}),
      ...(params.search
        ? {
            OR: [
              { voucherNumber: { contains: params.search, mode: "insensitive" } },
              { partyName: { contains: params.search, mode: "insensitive" } },
              { payeeName: { contains: params.search, mode: "insensitive" } },
              { reference: { contains: params.search, mode: "insensitive" } },
              { description: { contains: params.search, mode: "insensitive" } }
            ]
          }
        : {})
    };

    const [vouchers, total] = await Promise.all([
      this.prisma.voucher.findMany({
        where,
        orderBy: { date: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
        include: VOUCHER_INCLUDE
      }),
      this.prisma.voucher.count({ where })
    ]);

    return { vouchers, total };
  }

  async findVoucherOrThrow(tenantId: string, id: string): Promise<Voucher> {
    const voucher = await this.prisma.voucher.findFirst({
      where: { id, tenantId },
      include: VOUCHER_INCLUDE
    });
    if (!voucher) throw new NotFoundException("Voucher not found");
    return voucher;
  }

  async createVoucher(actor: ActorContext, dto: CreateVoucherDto, context: RequestContext) {
    await this.accountingService.findAccountOrThrow(actor.tenantId, dto.accountId);

    const settings = await this.settingsService.getSettings(actor.tenantId);
    const prefix = dto.type === "RECEIPT" ? (settings.receiptPrefix || "RCT") : (settings.voucherPrefix || "VCH");
    const voucherNumber = await this.certificates.nextNumber(actor.tenantId, `VOUCHER_${dto.type}`, prefix);

    const amount = new Prisma.Decimal(dto.amount);
    const date = new Date(dto.date);
    const status = dto.status ?? (dto.type === "RECEIPT" ? "PAID" : "DRAFT");

    let journalEntryId: string | null = null;

    // If created directly in PAID state (e.g. direct receipt or instant cash payment)
    if (status === "PAID" && dto.type === "PAYMENT") {
      let creditAccountId = settings.defaultCashAccountId;
      if (dto.bankAccountId) {
        const bank = await this.prisma.financeBankAccount.findFirst({ where: { id: dto.bankAccountId, tenantId: actor.tenantId } });
        if (bank?.chartAccountId) creditAccountId = bank.chartAccountId;
        else if (settings.defaultBankAccountId) creditAccountId = settings.defaultBankAccountId;
      } else if (dto.paymentMethod === "Bank Transfer" || dto.paymentMethod === "UPI") {
        if (settings.defaultBankAccountId) creditAccountId = settings.defaultBankAccountId;
      }

      if (creditAccountId) {
        const entry = await this.accountingService.createJournalEntry(
          actor,
          {
            date: dto.date,
            reference: voucherNumber,
            description: dto.description || `Payment to ${dto.payeeName || dto.partyName || "Payee"}`,
            sourceType: "EXPENSE",
            lines: [
              { accountId: dto.accountId, debit: amount.toFixed(2), credit: "0.00", description: dto.description },
              { accountId: creditAccountId, debit: "0.00", credit: amount.toFixed(2), description: `Paid via ${dto.paymentMethod || "Cash"}` }
            ]
          },
          context
        );
        journalEntryId = entry.id;

        if (dto.bankAccountId) {
          await this.prisma.financeBankAccount.update({
            where: { id: dto.bankAccountId },
            data: { currentBalance: { decrement: amount } }
          });
        }
      }
    }

    const voucher = await this.prisma.voucher.create({
      data: {
        tenantId: actor.tenantId,
        voucherNumber,
        type: dto.type,
        voucherSubtype: dto.voucherSubtype ?? "EXPENSE",
        status,
        accountId: dto.accountId,
        memberId: dto.memberId ?? null,
        eventId: dto.eventId ?? null,
        expenseCategoryId: dto.expenseCategoryId ?? null,
        bankAccountId: dto.bankAccountId ?? null,
        date,
        amount,
        partyName: dto.partyName ?? null,
        payeeName: dto.payeeName ?? dto.partyName ?? null,
        paymentMethod: dto.paymentMethod ?? "Cash",
        reference: dto.reference ?? null,
        description: dto.description ?? null,
        attachmentUrl: dto.attachmentUrl ?? null,
        notes: dto.notes ?? null,
        paidAt: status === "PAID" ? new Date() : null,
        journalEntryId
      },
      include: VOUCHER_INCLUDE
    });

    await this.audit.record({
      actorUserId: actor.userId,
      tenantId: actor.tenantId,
      action: "expenses.voucher.create",
      targetType: "Voucher",
      targetId: voucher.id,
      metadata: { voucherNumber, amount: amount.toFixed(2), status },
      ipAddress: context.ipAddress,
      userAgent: context.userAgent
    });

    return voucher;
  }

  async updateVoucher(actor: ActorContext, id: string, dto: UpdateVoucherDto, context: RequestContext) {
    const existing = await this.findVoucherOrThrow(actor.tenantId, id);
    if (existing.status === "PAID" || existing.status === "CANCELLED") {
      throw new BadRequestException(`Cannot edit voucher with status ${existing.status}.`);
    }

    const updated = await this.prisma.voucher.update({
      where: { id },
      data: {
        ...dto,
        ...(dto.date ? { date: new Date(dto.date) } : {}),
        ...(dto.amount ? { amount: new Prisma.Decimal(dto.amount) } : {})
      },
      include: VOUCHER_INCLUDE
    });

    await this.audit.record({
      actorUserId: actor.userId,
      tenantId: actor.tenantId,
      action: "expenses.voucher.update",
      targetType: "Voucher",
      targetId: id,
      metadata: { previous: existing, updated: dto },
      ipAddress: context.ipAddress,
      userAgent: context.userAgent
    });

    return updated;
  }

  async submitVoucher(actor: ActorContext, id: string, context: RequestContext) {
    const voucher = await this.findVoucherOrThrow(actor.tenantId, id);
    if (voucher.status !== "DRAFT") throw new BadRequestException("Only draft vouchers can be submitted.");

    const updated = await this.prisma.voucher.update({
      where: { id },
      data: { status: "SUBMITTED" },
      include: VOUCHER_INCLUDE
    });

    await this.audit.record({
      actorUserId: actor.userId,
      tenantId: actor.tenantId,
      action: "expenses.voucher.submit",
      targetType: "Voucher",
      targetId: id,
      ipAddress: context.ipAddress,
      userAgent: context.userAgent
    });

    return updated;
  }

  async approveVoucher(actor: ActorContext, id: string, context: RequestContext) {
    const voucher = await this.findVoucherOrThrow(actor.tenantId, id);
    if (voucher.status !== "DRAFT" && voucher.status !== "SUBMITTED") {
      throw new BadRequestException(`Voucher cannot be approved in state ${voucher.status}.`);
    }

    const updated = await this.prisma.voucher.update({
      where: { id },
      data: {
        status: "APPROVED",
        approvedBy: actor.userId,
        approvedAt: new Date()
      },
      include: VOUCHER_INCLUDE
    });

    await this.audit.record({
      actorUserId: actor.userId,
      tenantId: actor.tenantId,
      action: "expenses.voucher.approve",
      targetType: "Voucher",
      targetId: id,
      ipAddress: context.ipAddress,
      userAgent: context.userAgent
    });

    return updated;
  }

  async payVoucher(
    actor: ActorContext,
    id: string,
    payload: { paymentMethod?: string; bankAccountId?: string },
    context: RequestContext
  ) {
    const voucher = await this.findVoucherOrThrow(actor.tenantId, id);
    if (voucher.status === "PAID") return voucher;
    if (voucher.status === "CANCELLED") throw new BadRequestException("Cannot pay a cancelled voucher.");

    const settings = await this.settingsService.getSettings(actor.tenantId);

    let creditAccountId = settings.defaultCashAccountId;
    const bankAccountId = payload.bankAccountId ?? voucher.bankAccountId;
    const paymentMethod = payload.paymentMethod ?? voucher.paymentMethod ?? "Cash";

    if (bankAccountId) {
      const bank = await this.prisma.financeBankAccount.findFirst({ where: { id: bankAccountId, tenantId: actor.tenantId } });
      if (bank?.chartAccountId) creditAccountId = bank.chartAccountId;
      else if (settings.defaultBankAccountId) creditAccountId = settings.defaultBankAccountId;
    } else if (paymentMethod === "Bank Transfer" || paymentMethod === "UPI") {
      if (settings.defaultBankAccountId) creditAccountId = settings.defaultBankAccountId;
    }

    if (!creditAccountId) {
      const defaultCash = await this.prisma.account.findFirst({
        where: { tenantId: actor.tenantId, type: "ASSET", isActive: true }
      });
      creditAccountId = defaultCash?.id ?? null;
    }

    if (!creditAccountId) {
      throw new BadRequestException("No cash or bank account configured to disburse payment from.");
    }

    // Atomic post journal + update voucher
    const result = await this.prisma.$transaction(async (tx) => {
      const entryNumber = await this.certificates.nextNumber(actor.tenantId, "JOURNAL_ENTRY", "JRN");
      const activeFy = await this.accountingService.getCurrentFinancialYear(actor.tenantId);

      const journal = await tx.journalEntry.create({
        data: {
          tenantId: actor.tenantId,
          entryNumber,
          financialYearId: activeFy?.id ?? null,
          date: new Date(),
          reference: voucher.voucherNumber ?? undefined,
          description: voucher.description || `Disbursement to ${voucher.payeeName || voucher.partyName || "Payee"}`,
          sourceType: "EXPENSE",
          sourceId: voucher.id,
          status: "POSTED",
          totalDebit: voucher.amount,
          totalCredit: voucher.amount,
          postedAt: new Date(),
          postedBy: actor.userId,
          lines: {
            create: [
              { accountId: voucher.accountId, debit: voucher.amount, credit: new Prisma.Decimal(0), description: voucher.description },
              { accountId: creditAccountId, debit: new Prisma.Decimal(0), credit: voucher.amount, description: `Paid via ${paymentMethod}` }
            ]
          }
        }
      });

      await tx.account.update({ where: { id: voucher.accountId }, data: { currentBalance: { increment: voucher.amount } } });
      await tx.account.update({ where: { id: creditAccountId }, data: { currentBalance: { decrement: voucher.amount } } });

      if (bankAccountId) {
        await tx.financeBankAccount.update({
          where: { id: bankAccountId },
          data: { currentBalance: { decrement: voucher.amount } }
        });
      }

      return tx.voucher.update({
        where: { id },
        data: {
          status: "PAID",
          paidAt: new Date(),
          paymentMethod,
          bankAccountId,
          journalEntryId: journal.id
        },
        include: VOUCHER_INCLUDE
      });
    });

    await this.audit.record({
      actorUserId: actor.userId,
      tenantId: actor.tenantId,
      action: "expenses.voucher.pay",
      targetType: "Voucher",
      targetId: id,
      metadata: { voucherNumber: voucher.voucherNumber, amount: voucher.amount.toFixed(2) },
      ipAddress: context.ipAddress,
      userAgent: context.userAgent
    });

    return result;
  }

  async cancelVoucher(actor: ActorContext, id: string, reason: string | undefined, context: RequestContext) {
    const voucher = await this.findVoucherOrThrow(actor.tenantId, id);
    if (voucher.status === "CANCELLED") throw new BadRequestException("Voucher is already cancelled.");

    const cancelReason = reason?.trim() || "Cancelled by administrator";

    await this.prisma.$transaction(async (tx) => {
      // If was paid, reverse journal entry
      if (voucher.status === "PAID" && voucher.journalEntryId) {
        const journal = await tx.journalEntry.findUnique({
          where: { id: voucher.journalEntryId },
          include: { lines: true }
        });
        if (journal) {
          for (const line of journal.lines) {
            const net = line.debit.minus(line.credit);
            await tx.account.update({
              where: { id: line.accountId },
              data: { currentBalance: { decrement: net } }
            });
          }
          await tx.journalEntry.update({
            where: { id: journal.id },
            data: { status: "CANCELLED", description: `${journal.description} [CANCELLED: ${cancelReason}]` }
          });
        }

        if (voucher.bankAccountId) {
          await tx.financeBankAccount.update({
            where: { id: voucher.bankAccountId },
            data: { currentBalance: { increment: voucher.amount } }
          });
        }
      }

      await tx.voucher.update({
        where: { id },
        data: {
          status: "CANCELLED",
          notes: `${voucher.notes ?? ""} [CANCELLED: ${cancelReason}]`
        }
      });
    });

    await this.audit.record({
      actorUserId: actor.userId,
      tenantId: actor.tenantId,
      action: "expenses.voucher.cancel",
      targetType: "Voucher",
      targetId: id,
      metadata: { voucherNumber: voucher.voucherNumber, reason: cancelReason },
      ipAddress: context.ipAddress,
      userAgent: context.userAgent
    });

    return { success: true };
  }
}
