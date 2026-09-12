import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { Prisma, type Account, type Due, type SalaryRecord, type Voucher } from "@mahalle/database";
import { PrismaService } from "../database/prisma.service";
import { AuditService } from "../audit/audit.service";
import { CertificateService } from "../registers/certificates/certificate.service";
import type { CreateAccountDto } from "./dto/create-account.dto";
import type { UpdateAccountDto } from "./dto/update-account.dto";
import type { CreateVoucherDto } from "./dto/create-voucher.dto";
import type { UpdateVoucherDto } from "./dto/update-voucher.dto";
import type { CreateDueDto } from "./dto/create-due.dto";
import type { UpdateDueDto } from "./dto/update-due.dto";
import type { MarkDuePaidDto } from "./dto/mark-due-paid.dto";
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

const VOUCHER_INCLUDE = { account: true, member: { select: { id: true, fullName: true } } } as const;
export type VoucherWithDetail = Prisma.VoucherGetPayload<{ include: typeof VOUCHER_INCLUDE }>;

@Injectable()
export class FinanceService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
    private readonly certificates: CertificateService
  ) {}

  // --- Accounts -----------------------------------------------------------

  async listAccounts(tenantId: string): Promise<Account[]> {
    return this.prisma.account.findMany({ where: { tenantId, isActive: true }, orderBy: [{ type: "asc" }, { name: "asc" }] });
  }

  private async findAccountOrThrow(tenantId: string, id: string): Promise<Account> {
    const account = await this.prisma.account.findFirst({ where: { id, tenantId, isActive: true } });
    if (!account) throw new NotFoundException("Account not found");
    return account;
  }

  async createAccount(actor: ActorContext, dto: CreateAccountDto, context: RequestContext): Promise<Account> {
    let account: Account;
    try {
      account = await this.prisma.account.create({ data: { ...dto, tenantId: actor.tenantId } });
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
        throw new ConflictException("An account with this name already exists.");
      }
      throw err;
    }
    await this.audit.record({
      actorUserId: actor.userId,
      tenantId: actor.tenantId,
      action: "finance.account.create",
      targetType: "Account",
      targetId: account.id,
      ipAddress: context.ipAddress,
      userAgent: context.userAgent
    });
    return account;
  }

  async updateAccount(actor: ActorContext, id: string, dto: UpdateAccountDto, context: RequestContext): Promise<Account> {
    await this.findAccountOrThrow(actor.tenantId, id);
    const account = await this.prisma.account.update({ where: { id }, data: dto });
    await this.audit.record({
      actorUserId: actor.userId,
      tenantId: actor.tenantId,
      action: "finance.account.update",
      targetType: "Account",
      targetId: id,
      ipAddress: context.ipAddress,
      userAgent: context.userAgent
    });
    return account;
  }

  async removeAccount(actor: ActorContext, id: string, context: RequestContext): Promise<void> {
    await this.findAccountOrThrow(actor.tenantId, id);
    await this.prisma.account.update({ where: { id }, data: { isActive: false } });
    await this.audit.record({
      actorUserId: actor.userId,
      tenantId: actor.tenantId,
      action: "finance.account.delete",
      targetType: "Account",
      targetId: id,
      ipAddress: context.ipAddress,
      userAgent: context.userAgent
    });
  }

  // --- Vouchers -------------------------------------------------------------

  async listVouchers(tenantId: string, page: number, pageSize: number): Promise<{ vouchers: VoucherWithDetail[]; total: number }> {
    const where = { tenantId };
    const [vouchers, total] = await Promise.all([
      this.prisma.voucher.findMany({ where, orderBy: { date: "desc" }, skip: (page - 1) * pageSize, take: pageSize, include: VOUCHER_INCLUDE }),
      this.prisma.voucher.count({ where })
    ]);
    return { vouchers, total };
  }

  private async findVoucherOrThrow(tenantId: string, id: string): Promise<Voucher> {
    const voucher = await this.prisma.voucher.findFirst({ where: { id, tenantId } });
    if (!voucher) throw new NotFoundException("Voucher not found");
    return voucher;
  }

  async createVoucher(actor: ActorContext, dto: CreateVoucherDto, context: RequestContext): Promise<VoucherWithDetail> {
    await this.findAccountOrThrow(actor.tenantId, dto.accountId);
    const prefix = dto.type === "RECEIPT" ? "RCT" : "PAY";
    const voucherNumber = await this.certificates.nextNumber(actor.tenantId, `VOUCHER_${dto.type}`, prefix);
    const { date, ...rest } = dto;
    const voucher = await this.prisma.voucher.create({
      data: { ...rest, date: new Date(date), voucherNumber, tenantId: actor.tenantId },
      include: VOUCHER_INCLUDE
    });
    await this.audit.record({
      actorUserId: actor.userId,
      tenantId: actor.tenantId,
      action: "finance.voucher.create",
      targetType: "Voucher",
      targetId: voucher.id,
      metadata: { voucherNumber, amount: dto.amount },
      ipAddress: context.ipAddress,
      userAgent: context.userAgent
    });
    return voucher;
  }

  async updateVoucher(actor: ActorContext, id: string, dto: UpdateVoucherDto, context: RequestContext): Promise<VoucherWithDetail> {
    await this.findVoucherOrThrow(actor.tenantId, id);
    if (dto.accountId) await this.findAccountOrThrow(actor.tenantId, dto.accountId);
    const { date, ...rest } = dto;
    const voucher = await this.prisma.voucher.update({
      where: { id },
      data: { ...rest, ...(date !== undefined && { date: new Date(date) }) },
      include: VOUCHER_INCLUDE
    });
    await this.audit.record({
      actorUserId: actor.userId,
      tenantId: actor.tenantId,
      action: "finance.voucher.update",
      targetType: "Voucher",
      targetId: id,
      ipAddress: context.ipAddress,
      userAgent: context.userAgent
    });
    return voucher;
  }

  async removeVoucher(actor: ActorContext, id: string, context: RequestContext): Promise<void> {
    await this.findVoucherOrThrow(actor.tenantId, id);
    await this.prisma.voucher.delete({ where: { id } });
    await this.audit.record({
      actorUserId: actor.userId,
      tenantId: actor.tenantId,
      action: "finance.voucher.delete",
      targetType: "Voucher",
      targetId: id,
      ipAddress: context.ipAddress,
      userAgent: context.userAgent
    });
  }

  // --- Dues -----------------------------------------------------------------

  async listDues(tenantId: string, page: number, pageSize: number) {
    const where = { tenantId };
    const [dues, total] = await Promise.all([
      this.prisma.due.findMany({
        where,
        orderBy: { dueDate: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
        include: { member: { select: { id: true, fullName: true } } }
      }),
      this.prisma.due.count({ where })
    ]);
    return { dues, total };
  }

  private async findDueOrThrow(tenantId: string, id: string): Promise<Due> {
    const due = await this.prisma.due.findFirst({ where: { id, tenantId } });
    if (!due) throw new NotFoundException("Due not found");
    return due;
  }

  async createDue(actor: ActorContext, dto: CreateDueDto, context: RequestContext): Promise<Due> {
    const member = await this.prisma.member.findFirst({ where: { id: dto.memberId, tenantId: actor.tenantId } });
    if (!member) throw new NotFoundException("Member not found");
    const { dueDate, ...rest } = dto;
    const due = await this.prisma.due.create({ data: { ...rest, dueDate: new Date(dueDate), tenantId: actor.tenantId } });
    await this.audit.record({
      actorUserId: actor.userId,
      tenantId: actor.tenantId,
      action: "finance.due.create",
      targetType: "Due",
      targetId: due.id,
      ipAddress: context.ipAddress,
      userAgent: context.userAgent
    });
    return due;
  }

  async updateDue(actor: ActorContext, id: string, dto: UpdateDueDto, context: RequestContext): Promise<Due> {
    await this.findDueOrThrow(actor.tenantId, id);
    const { dueDate, ...rest } = dto;
    const due = await this.prisma.due.update({ where: { id }, data: { ...rest, ...(dueDate !== undefined && { dueDate: new Date(dueDate) }) } });
    await this.audit.record({
      actorUserId: actor.userId,
      tenantId: actor.tenantId,
      action: "finance.due.update",
      targetType: "Due",
      targetId: id,
      ipAddress: context.ipAddress,
      userAgent: context.userAgent
    });
    return due;
  }

  async markDuePaid(actor: ActorContext, id: string, dto: MarkDuePaidDto, context: RequestContext): Promise<Due> {
    const due = await this.findDueOrThrow(actor.tenantId, id);
    if (due.status === "PAID") return due;
    await this.findAccountOrThrow(actor.tenantId, dto.accountId);
    const voucherNumber = await this.certificates.nextNumber(actor.tenantId, "VOUCHER_RECEIPT", "RCT");
    const result = await this.prisma.$transaction(async (tx) => {
      const voucher = await tx.voucher.create({
        data: {
          tenantId: actor.tenantId,
          type: "RECEIPT",
          accountId: dto.accountId,
          memberId: due.memberId,
          date: new Date(),
          amount: due.amount,
          voucherNumber,
          paymentMethod: dto.paymentMethod,
          description: `Due settled: ${due.title}`
        }
      });
      return tx.due.update({ where: { id }, data: { status: "PAID", paidVoucherId: voucher.id } });
    });
    await this.audit.record({
      actorUserId: actor.userId,
      tenantId: actor.tenantId,
      action: "finance.due.paid",
      targetType: "Due",
      targetId: id,
      metadata: { voucherNumber },
      ipAddress: context.ipAddress,
      userAgent: context.userAgent
    });
    return result;
  }

  async removeDue(actor: ActorContext, id: string, context: RequestContext): Promise<void> {
    await this.findDueOrThrow(actor.tenantId, id);
    await this.prisma.due.delete({ where: { id } });
    await this.audit.record({
      actorUserId: actor.userId,
      tenantId: actor.tenantId,
      action: "finance.due.delete",
      targetType: "Due",
      targetId: id,
      ipAddress: context.ipAddress,
      userAgent: context.userAgent
    });
  }

  // --- Salary -----------------------------------------------------------------

  async listSalaryRecords(tenantId: string, page: number, pageSize: number) {
    const where = { tenantId };
    const [records, total] = await Promise.all([
      this.prisma.salaryRecord.findMany({ where, orderBy: { month: "desc" }, skip: (page - 1) * pageSize, take: pageSize }),
      this.prisma.salaryRecord.count({ where })
    ]);
    return { records, total };
  }

  private async findSalaryRecordOrThrow(tenantId: string, id: string): Promise<SalaryRecord> {
    const record = await this.prisma.salaryRecord.findFirst({ where: { id, tenantId } });
    if (!record) throw new NotFoundException("Salary record not found");
    return record;
  }

  async createSalaryRecord(actor: ActorContext, dto: CreateSalaryRecordDto, context: RequestContext): Promise<SalaryRecord> {
    let record: SalaryRecord;
    try {
      record = await this.prisma.salaryRecord.create({ data: { ...dto, tenantId: actor.tenantId } });
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
        throw new ConflictException("A salary record for this staff member and month already exists.");
      }
      throw err;
    }
    await this.audit.record({
      actorUserId: actor.userId,
      tenantId: actor.tenantId,
      action: "finance.salary.create",
      targetType: "SalaryRecord",
      targetId: record.id,
      ipAddress: context.ipAddress,
      userAgent: context.userAgent
    });
    return record;
  }

  async markSalaryPaid(actor: ActorContext, id: string, dto: MarkSalaryPaidDto, context: RequestContext): Promise<SalaryRecord> {
    const record = await this.findSalaryRecordOrThrow(actor.tenantId, id);
    if (record.status === "PAID") return record;
    await this.findAccountOrThrow(actor.tenantId, dto.accountId);
    const voucherNumber = await this.certificates.nextNumber(actor.tenantId, "VOUCHER_PAYMENT", "PAY");
    const result = await this.prisma.$transaction(async (tx) => {
      const voucher = await tx.voucher.create({
        data: {
          tenantId: actor.tenantId,
          type: "PAYMENT",
          accountId: dto.accountId,
          date: new Date(),
          amount: record.amount,
          voucherNumber,
          partyName: record.staffName,
          paymentMethod: dto.paymentMethod,
          description: `Salary for ${record.month}`
        }
      });
      return tx.salaryRecord.update({ where: { id }, data: { status: "PAID", paidVoucherId: voucher.id } });
    });
    await this.audit.record({
      actorUserId: actor.userId,
      tenantId: actor.tenantId,
      action: "finance.salary.paid",
      targetType: "SalaryRecord",
      targetId: id,
      metadata: { voucherNumber },
      ipAddress: context.ipAddress,
      userAgent: context.userAgent
    });
    return result;
  }

  async removeSalaryRecord(actor: ActorContext, id: string, context: RequestContext): Promise<void> {
    await this.findSalaryRecordOrThrow(actor.tenantId, id);
    await this.prisma.salaryRecord.delete({ where: { id } });
    await this.audit.record({
      actorUserId: actor.userId,
      tenantId: actor.tenantId,
      action: "finance.salary.delete",
      targetType: "SalaryRecord",
      targetId: id,
      ipAddress: context.ipAddress,
      userAgent: context.userAgent
    });
  }

  // --- Reports ----------------------------------------------------------------

  /** Chronological cash movements with a running balance — the Mahallu's cash book. */
  async cashBook(tenantId: string) {
    const vouchers = await this.prisma.voucher.findMany({
      where: { tenantId },
      orderBy: [{ date: "asc" }, { createdAt: "asc" }],
      include: VOUCHER_INCLUDE
    });
    let balance = new Prisma.Decimal(0);
    const rows = vouchers.map((voucher) => {
      balance = voucher.type === "RECEIPT" ? balance.plus(voucher.amount) : balance.minus(voucher.amount);
      return { voucher, balance: balance.toFixed(2) };
    });
    return { rows, closingBalance: balance.toFixed(2) };
  }

  /**
   * Per-account income/expense totals plus an overall summary. This is a
   * single-entry category summary, not a double-entry trial balance — see
   * the schema's Finance section comment for why a formal trial balance is
   * deferred until the accounting model gets accountant review.
   */
  async summary(tenantId: string) {
    const accounts = await this.prisma.account.findMany({ where: { tenantId, isActive: true } });
    const totals = await this.prisma.voucher.groupBy({
      by: ["accountId", "type"],
      where: { tenantId },
      _sum: { amount: true }
    });
    const byAccount = accounts.map((account) => {
      const received = totals.find((t) => t.accountId === account.id && t.type === "RECEIPT")?._sum.amount ?? new Prisma.Decimal(0);
      const paid = totals.find((t) => t.accountId === account.id && t.type === "PAYMENT")?._sum.amount ?? new Prisma.Decimal(0);
      return { account, totalReceived: received.toFixed(2), totalPaid: paid.toFixed(2) };
    });
    const totalIncome = totals.filter((t) => t.type === "RECEIPT").reduce((sum, t) => sum.plus(t._sum.amount ?? 0), new Prisma.Decimal(0));
    const totalExpense = totals.filter((t) => t.type === "PAYMENT").reduce((sum, t) => sum.plus(t._sum.amount ?? 0), new Prisma.Decimal(0));
    return {
      byAccount,
      totalIncome: totalIncome.toFixed(2),
      totalExpense: totalExpense.toFixed(2),
      netPosition: totalIncome.minus(totalExpense).toFixed(2)
    };
  }
}
