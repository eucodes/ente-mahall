import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { Prisma, type Due } from "@mahalle/database";
import { PrismaService } from "../database/prisma.service";
import { AuditService } from "../audit/audit.service";
import { CertificateService } from "../registers/certificates/certificate.service";
import { FinanceSettingsService } from "./finance-settings.service";
import { AccountingService } from "./accounting.service";
import type { CreateDueDto } from "./dto/create-due.dto";
import type { UpdateDueDto } from "./dto/update-due.dto";
import type { MarkDuePaidDto } from "./dto/mark-due-paid.dto";

interface RequestContext {
  ipAddress?: string;
  userAgent?: string;
}

interface ActorContext {
  userId: string;
  tenantId: string;
}

const DUE_INCLUDE = {
  member: { select: { id: true, fullName: true, phone: true } },
  family: { select: { id: true, name: true, familyNumber: true, house: { select: { displayNumber: true, divisionId: true } } } },
  category: { select: { id: true, name: true, code: true } },
  paidVoucher: true
} as const;

@Injectable()
export class DuesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
    private readonly certificates: CertificateService,
    private readonly settingsService: FinanceSettingsService,
    private readonly accountingService: AccountingService
  ) {}

  async listDues(
    tenantId: string,
    params: {
      status?: "PENDING" | "PAID" | "WAIVED";
      familyId?: string;
      memberId?: string;
      divisionId?: string;
      categoryId?: string;
      period?: string;
      page?: number;
      pageSize?: number;
    }
  ) {
    const page = params.page ?? 1;
    const pageSize = params.pageSize ?? 20;

    const where: Prisma.DueWhereInput = {
      tenantId,
      ...(params.status ? { status: params.status } : {}),
      ...(params.familyId ? { familyId: params.familyId } : {}),
      ...(params.memberId ? { memberId: params.memberId } : {}),
      ...(params.categoryId ? { categoryId: params.categoryId } : {}),
      ...(params.period ? { period: params.period } : {}),
      ...(params.divisionId
        ? {
            family: { house: { divisionId: params.divisionId } }
          }
        : {})
    };

    const [dues, total] = await Promise.all([
      this.prisma.due.findMany({
        where,
        orderBy: { dueDate: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
        include: DUE_INCLUDE
      }),
      this.prisma.due.count({ where })
    ]);

    return { dues, total };
  }

  async findDueOrThrow(tenantId: string, id: string): Promise<Due> {
    const due = await this.prisma.due.findFirst({
      where: { id, tenantId },
      include: DUE_INCLUDE
    });
    if (!due) throw new NotFoundException("Due not found");
    return due;
  }

  async createDue(actor: ActorContext, dto: CreateDueDto, context: RequestContext): Promise<Due> {
    if (!dto.memberId && !dto.familyId) {
      throw new BadRequestException("A due must be assigned to either a member or a family.");
    }

    if (dto.memberId) {
      const member = await this.prisma.member.findFirst({ where: { id: dto.memberId, tenantId: actor.tenantId } });
      if (!member) throw new NotFoundException("Member not found");
    }

    if (dto.familyId) {
      const family = await this.prisma.family.findFirst({ where: { id: dto.familyId, tenantId: actor.tenantId } });
      if (!family) throw new NotFoundException("Family not found");
    }

    const amount = new Prisma.Decimal(dto.amount);
    const dueDate = new Date(dto.dueDate);

    // Fallback: If memberId is missing but familyId is provided, get the family head or any member
    let memberId = dto.memberId;
    if (!memberId && dto.familyId) {
      const head = await this.prisma.member.findFirst({
        where: { familyId: dto.familyId, tenantId: actor.tenantId, relationToHead: "HEAD" }
      });
      if (head) {
        memberId = head.id;
      } else {
        const anyMember = await this.prisma.member.findFirst({
          where: { familyId: dto.familyId, tenantId: actor.tenantId }
        });
        if (anyMember) memberId = anyMember.id;
      }
    }

    if (!memberId) {
      throw new BadRequestException("Could not associate due with a valid member in the tenant.");
    }

    const due = await this.prisma.due.create({
      data: {
        tenantId: actor.tenantId,
        memberId,
        familyId: dto.familyId ?? null,
        categoryId: dto.categoryId ?? null,
        title: dto.title,
        period: dto.period ?? null,
        amount,
        paidAmount: new Prisma.Decimal(0),
        outstandingAmount: amount,
        dueDate,
        status: "PENDING"
      },
      include: DUE_INCLUDE
    });

    await this.audit.record({
      actorUserId: actor.userId,
      tenantId: actor.tenantId,
      action: "dues.create",
      targetType: "Due",
      targetId: due.id,
      metadata: { title: due.title, amount: amount.toFixed(2), dueDate: dto.dueDate },
      ipAddress: context.ipAddress,
      userAgent: context.userAgent
    });

    return due;
  }

  async updateDue(actor: ActorContext, id: string, dto: UpdateDueDto, context: RequestContext): Promise<Due> {
    await this.findDueOrThrow(actor.tenantId, id);

    const updated = await this.prisma.due.update({
      where: { id },
      data: {
        title: dto.title,
        ...(dto.amount ? { amount: new Prisma.Decimal(dto.amount), outstandingAmount: new Prisma.Decimal(dto.amount) } : {}),
        ...(dto.dueDate ? { dueDate: new Date(dto.dueDate) } : {})
      },
      include: DUE_INCLUDE
    });

    await this.audit.record({
      actorUserId: actor.userId,
      tenantId: actor.tenantId,
      action: "dues.update",
      targetType: "Due",
      targetId: id,
      metadata: { updated: dto },
      ipAddress: context.ipAddress,
      userAgent: context.userAgent
    });

    return updated;
  }

  async markDuePaid(actor: ActorContext, id: string, dto: MarkDuePaidDto, context: RequestContext) {
    const due = await this.findDueOrThrow(actor.tenantId, id);
    if (due.status === "PAID") return due;

    const settings = await this.settingsService.getSettings(actor.tenantId);
    const accountId = dto.accountId || settings.defaultCollectionIncomeAccountId;
    if (!accountId) {
      throw new BadRequestException("No income account configured for collections.");
    }
    await this.accountingService.findAccountOrThrow(actor.tenantId, accountId);

    const paymentMethod = dto.paymentMethod || "Cash";
    let debitAccountId = settings.defaultCashAccountId;
    if (paymentMethod === "Bank Transfer" || paymentMethod === "UPI") {
      debitAccountId = settings.defaultBankAccountId || debitAccountId;
    }

    const prefix = settings.receiptPrefix || "RCP";
    const receiptNumber = await this.certificates.nextNumber(actor.tenantId, "RECEIPT", prefix);
    const voucherNumber = await this.certificates.nextNumber(actor.tenantId, "VOUCHER_RECEIPT", "RCT");

    const result = await this.prisma.$transaction(async (tx) => {
      // 1. Create Receipt
      const receipt = await tx.financeReceipt.create({
        data: {
          tenantId: actor.tenantId,
          receiptNumber,
          date: new Date(),
          receivedFrom: (due as any).member?.fullName || "Member",
          categoryName: (due as any).category?.name || "Dues & Varisa",
          amount: due.amount,
          paymentMethod,
          description: `Settlement for: ${due.title}`,
          recordedBy: actor.userId,
          status: "ACTIVE"
        }
      });

      // 2. Create Voucher
      const voucher = await tx.voucher.create({
        data: {
          tenantId: actor.tenantId,
          type: "RECEIPT",
          voucherSubtype: "RECEIPT",
          status: "PAID",
          accountId,
          memberId: due.memberId,
          date: new Date(),
          amount: due.amount,
          voucherNumber,
          partyName: (due as any).member?.fullName,
          paymentMethod,
          description: `Due settled: ${due.title}`,
          receiptId: receipt.id,
          paidAt: new Date()
        }
      });

      // 3. Post Journal Entry if debit account exists
      if (debitAccountId) {
        const entryNumber = await this.certificates.nextNumber(actor.tenantId, "JOURNAL_ENTRY", "JRN");
        const activeFy = await this.accountingService.getCurrentFinancialYear(actor.tenantId);

        const journal = await tx.journalEntry.create({
          data: {
            tenantId: actor.tenantId,
            entryNumber,
            financialYearId: activeFy?.id ?? null,
            date: new Date(),
            reference: receiptNumber,
            description: `Settlement of due: ${due.title}`,
            sourceType: "DUE",
            sourceId: due.id,
            status: "POSTED",
            totalDebit: due.amount,
            totalCredit: due.amount,
            postedAt: new Date(),
            postedBy: actor.userId,
            lines: {
              create: [
                { accountId: debitAccountId, debit: due.amount, credit: new Prisma.Decimal(0), description: `Received via ${paymentMethod}` },
                { accountId, debit: new Prisma.Decimal(0), credit: due.amount, description: due.title }
              ]
            }
          }
        });

        await tx.account.update({ where: { id: debitAccountId }, data: { currentBalance: { increment: due.amount } } });
        await tx.account.update({ where: { id: accountId }, data: { currentBalance: { increment: due.amount } } });
        await tx.voucher.update({ where: { id: voucher.id }, data: { journalEntryId: journal.id } });
      }

      // 4. Update Due record
      return tx.due.update({
        where: { id },
        data: {
          status: "PAID",
          paidAmount: due.amount,
          outstandingAmount: new Prisma.Decimal(0),
          paidVoucherId: voucher.id
        },
        include: DUE_INCLUDE
      });
    });

    await this.audit.record({
      actorUserId: actor.userId,
      tenantId: actor.tenantId,
      action: "dues.paid",
      targetType: "Due",
      targetId: id,
      metadata: { receiptNumber, voucherNumber, amount: due.amount.toFixed(2) },
      ipAddress: context.ipAddress,
      userAgent: context.userAgent
    });

    return result;
  }

  async removeDue(actor: ActorContext, id: string, context: RequestContext): Promise<void> {
    const due = await this.findDueOrThrow(actor.tenantId, id);
    if (due.status === "PAID") {
      throw new BadRequestException("Cannot delete a paid due.");
    }

    await this.prisma.due.delete({ where: { id } });

    await this.audit.record({
      actorUserId: actor.userId,
      tenantId: actor.tenantId,
      action: "dues.delete",
      targetType: "Due",
      targetId: id,
      metadata: { title: due.title },
      ipAddress: context.ipAddress,
      userAgent: context.userAgent
    });
  }

  async getDuesSummary(tenantId: string) {
    const dues = await this.prisma.due.findMany({ where: { tenantId } });

    let totalExpected = new Prisma.Decimal(0);
    let totalCollected = new Prisma.Decimal(0);
    let totalOutstanding = new Prisma.Decimal(0);

    dues.forEach((d) => {
      totalExpected = totalExpected.plus(d.amount);
      totalCollected = totalCollected.plus(d.paidAmount);
      if (d.status === "PENDING") {
        totalOutstanding = totalOutstanding.plus(d.amount.minus(d.paidAmount));
      }
    });

    return {
      totalDuesCount: dues.length,
      totalExpected: totalExpected.toFixed(2),
      totalCollected: totalCollected.toFixed(2),
      totalOutstanding: totalOutstanding.toFixed(2)
    };
  }
}
