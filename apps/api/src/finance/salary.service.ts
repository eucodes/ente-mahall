import { BadRequestException, ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { Prisma, type SalaryRecord } from "@mahalle/database";
import { PrismaService } from "../database/prisma.service";
import { AuditService } from "../audit/audit.service";
import { CertificateService } from "../registers/certificates/certificate.service";
import { FinanceSettingsService } from "./finance-settings.service";
import { AccountingService } from "./accounting.service";
import type { CreateSalaryRecordDto } from "./dto/create-salary-record.dto";
import type { MarkSalaryPaidDto } from "./dto/mark-salary-paid.dto";

interface RequestContext {
  ipAddress?: string;
  userAgent?: string;
}

interface ActorContext {
  userId: string;
  tenantId: string;
}

@Injectable()
export class SalaryService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
    private readonly certificates: CertificateService,
    private readonly settingsService: FinanceSettingsService,
    private readonly accountingService: AccountingService
  ) {}

  async listSalaryRecords(tenantId: string, page = 1, pageSize = 20, month?: string, status?: string) {
    const where: Prisma.SalaryRecordWhereInput = {
      tenantId,
      ...(month ? { month } : {}),
      ...(status ? { status: status as any } : {})
    };

    const [records, total] = await Promise.all([
      this.prisma.salaryRecord.findMany({
        where,
        orderBy: [{ month: "desc" }, { staffName: "asc" }],
        skip: (page - 1) * pageSize,
        take: pageSize,
        include: { paidVoucher: true }
      }),
      this.prisma.salaryRecord.count({ where })
    ]);

    return { records, total };
  }

  async findSalaryRecordOrThrow(tenantId: string, id: string): Promise<SalaryRecord> {
    const record = await this.prisma.salaryRecord.findFirst({
      where: { id, tenantId },
      include: { paidVoucher: true }
    });
    if (!record) throw new NotFoundException("Salary record not found");
    return record;
  }

  async createSalaryRecord(actor: ActorContext, dto: CreateSalaryRecordDto, context: RequestContext) {
    const basic = dto.basicSalary ? new Prisma.Decimal(dto.basicSalary) : new Prisma.Decimal(dto.amount);
    const allow = dto.allowances ? new Prisma.Decimal(dto.allowances) : new Prisma.Decimal(0);
    const ded = dto.deductions ? new Prisma.Decimal(dto.deductions) : new Prisma.Decimal(0);
    const net = basic.plus(allow).minus(ded);

    let record: SalaryRecord;
    try {
      record = await this.prisma.salaryRecord.create({
        data: {
          tenantId: actor.tenantId,
          staffName: dto.staffName,
          month: dto.month,
          amount: net,
          basicSalary: basic,
          allowances: allow,
          deductions: ded,
          netSalary: net,
          status: "PENDING",
          approvalStatus: "DRAFT"
        }
      });
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
        throw new ConflictException("A salary record for this staff member and month already exists.");
      }
      throw err;
    }

    await this.audit.record({
      actorUserId: actor.userId,
      tenantId: actor.tenantId,
      action: "salary.create",
      targetType: "SalaryRecord",
      targetId: record.id,
      metadata: { staffName: record.staffName, month: record.month, netSalary: net.toFixed(2) },
      ipAddress: context.ipAddress,
      userAgent: context.userAgent
    });

    return record;
  }

  async approveSalaryRecord(actor: ActorContext, id: string, context: RequestContext) {
    const record = await this.findSalaryRecordOrThrow(actor.tenantId, id);
    if (record.approvalStatus === "PAID") {
      throw new BadRequestException("Salary record is already paid.");
    }

    const updated = await this.prisma.salaryRecord.update({
      where: { id },
      data: { approvalStatus: "APPROVED" }
    });

    await this.audit.record({
      actorUserId: actor.userId,
      tenantId: actor.tenantId,
      action: "salary.approve",
      targetType: "SalaryRecord",
      targetId: id,
      metadata: { staffName: record.staffName, month: record.month },
      ipAddress: context.ipAddress,
      userAgent: context.userAgent
    });

    return updated;
  }

  async markSalaryPaid(actor: ActorContext, id: string, dto: MarkSalaryPaidDto, context: RequestContext) {
    const record = await this.findSalaryRecordOrThrow(actor.tenantId, id);
    if (record.status === "PAID") return record;

    const settings = await this.settingsService.getSettings(actor.tenantId);
    const salaryExpenseAccountId = dto.accountId || settings.defaultSalaryExpenseAccountId;
    if (!salaryExpenseAccountId) {
      throw new BadRequestException("No salary expense account specified or configured.");
    }
    await this.accountingService.findAccountOrThrow(actor.tenantId, salaryExpenseAccountId);

    const voucherNumber = await this.certificates.nextNumber(actor.tenantId, "VOUCHER_PAYMENT", "PAY");
    const paymentMethod = dto.paymentMethod || "Cash";

    let creditAccountId = settings.defaultCashAccountId;
    if (paymentMethod === "Bank Transfer" || paymentMethod === "UPI") {
      creditAccountId = settings.defaultBankAccountId || creditAccountId;
    }

    const result = await this.prisma.$transaction(async (tx) => {
      // 1. Create Voucher
      const voucher = await tx.voucher.create({
        data: {
          tenantId: actor.tenantId,
          type: "PAYMENT",
          voucherSubtype: "EXPENSE",
          status: "PAID",
          accountId: salaryExpenseAccountId,
          date: new Date(),
          amount: record.amount,
          voucherNumber,
          partyName: record.staffName,
          payeeName: record.staffName,
          paymentMethod,
          description: `Salary for ${record.staffName} (${record.month})`,
          paidAt: new Date()
        }
      });

      // 2. Post Journal Entry if credit account exists
      if (creditAccountId) {
        const entryNumber = await this.certificates.nextNumber(actor.tenantId, "JOURNAL_ENTRY", "JRN");
        const activeFy = await this.accountingService.getCurrentFinancialYear(actor.tenantId);

        const journal = await tx.journalEntry.create({
          data: {
            tenantId: actor.tenantId,
            entryNumber,
            financialYearId: activeFy?.id ?? null,
            date: new Date(),
            reference: voucherNumber,
            description: `Salary for ${record.staffName} (${record.month})`,
            sourceType: "SALARY",
            sourceId: record.id,
            status: "POSTED",
            totalDebit: record.amount,
            totalCredit: record.amount,
            postedAt: new Date(),
            postedBy: actor.userId,
            lines: {
              create: [
                { accountId: salaryExpenseAccountId, debit: record.amount, credit: new Prisma.Decimal(0), description: `Salary Expense: ${record.staffName}` },
                { accountId: creditAccountId, debit: new Prisma.Decimal(0), credit: record.amount, description: `Paid via ${paymentMethod}` }
              ]
            }
          }
        });

        await tx.account.update({ where: { id: salaryExpenseAccountId }, data: { currentBalance: { increment: record.amount } } });
        await tx.account.update({ where: { id: creditAccountId }, data: { currentBalance: { decrement: record.amount } } });

        await tx.voucher.update({ where: { id: voucher.id }, data: { journalEntryId: journal.id } });
      }

      // 3. Mark salary record paid
      return tx.salaryRecord.update({
        where: { id },
        data: {
          status: "PAID",
          approvalStatus: "PAID",
          paymentDate: new Date(),
          paymentMethod,
          paidVoucherId: voucher.id
        }
      });
    });

    await this.audit.record({
      actorUserId: actor.userId,
      tenantId: actor.tenantId,
      action: "salary.pay",
      targetType: "SalaryRecord",
      targetId: id,
      metadata: { voucherNumber, amount: record.amount.toFixed(2) },
      ipAddress: context.ipAddress,
      userAgent: context.userAgent
    });

    return result;
  }

  async removeSalaryRecord(actor: ActorContext, id: string, context: RequestContext) {
    const record = await this.findSalaryRecordOrThrow(actor.tenantId, id);
    if (record.status === "PAID") {
      throw new BadRequestException("Cannot delete a paid salary record. Please cancel through the voucher flow.");
    }

    await this.prisma.salaryRecord.delete({ where: { id } });

    await this.audit.record({
      actorUserId: actor.userId,
      tenantId: actor.tenantId,
      action: "salary.delete",
      targetType: "SalaryRecord",
      targetId: id,
      metadata: { staffName: record.staffName, month: record.month },
      ipAddress: context.ipAddress,
      userAgent: context.userAgent
    });
  }

  async getSalarySummary(tenantId: string, month?: string) {
    const where: Prisma.SalaryRecordWhereInput = {
      tenantId,
      ...(month ? { month } : {})
    };

    const records = await this.prisma.salaryRecord.findMany({ where });

    let totalObligation = new Prisma.Decimal(0);
    let totalPaid = new Prisma.Decimal(0);
    let totalPending = new Prisma.Decimal(0);

    records.forEach((r) => {
      totalObligation = totalObligation.plus(r.amount);
      if (r.status === "PAID") {
        totalPaid = totalPaid.plus(r.amount);
      } else {
        totalPending = totalPending.plus(r.amount);
      }
    });

    return {
      month: month ?? "All Months",
      totalStaff: records.length,
      totalObligation: totalObligation.toFixed(2),
      totalPaid: totalPaid.toFixed(2),
      totalPending: totalPending.toFixed(2)
    };
  }
}
