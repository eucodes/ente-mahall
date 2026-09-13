import { BadRequestException, ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { Prisma, type Account, type FinancialYear, type JournalEntry, type JournalEntryLine } from "@mahalle/database";
import { PrismaService } from "../database/prisma.service";
import { AuditService } from "../audit/audit.service";
import { CertificateService } from "../registers/certificates/certificate.service";
import type { CreateAccountDto } from "./dto/create-account.dto";
import type { UpdateAccountDto } from "./dto/update-account.dto";
import type { CreateJournalEntryDto } from "./dto/create-journal-entry.dto";
import type { CreateFinancialYearDto } from "./dto/create-financial-year.dto";

interface RequestContext {
  ipAddress?: string;
  userAgent?: string;
}

interface ActorContext {
  userId: string;
  tenantId: string;
}

@Injectable()
export class AccountingService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
    private readonly certificates: CertificateService
  ) {}

  // --- Chart of Accounts ---------------------------------------------------

  async listAccounts(tenantId: string): Promise<Account[]> {
    return this.prisma.account.findMany({
      where: { tenantId, isActive: true },
      orderBy: [{ code: "asc" }, { name: "asc" }],
      include: {
        parentAccount: { select: { id: true, name: true, code: true } }
      }
    });
  }

  async getAccountHierarchy(tenantId: string) {
    const accounts = await this.prisma.account.findMany({
      where: { tenantId, isActive: true },
      orderBy: [{ code: "asc" }, { name: "asc" }]
    });

    const accountMap = new Map<string, any>();
    accounts.forEach((acc) => {
      accountMap.set(acc.id, { ...acc, children: [] });
    });

    const rootAccounts: any[] = [];
    accounts.forEach((acc) => {
      const node = accountMap.get(acc.id);
      if (acc.parentAccountId && accountMap.has(acc.parentAccountId)) {
        accountMap.get(acc.parentAccountId).children.push(node);
      } else {
        rootAccounts.push(node);
      }
    });

    return rootAccounts;
  }

  async findAccountOrThrow(tenantId: string, id: string): Promise<Account> {
    const account = await this.prisma.account.findFirst({
      where: { id, tenantId, isActive: true }
    });
    if (!account) throw new NotFoundException("Account not found");
    return account;
  }

  async createAccount(actor: ActorContext, dto: CreateAccountDto, context: RequestContext): Promise<Account> {
    if (dto.code) {
      const existing = await this.prisma.account.findFirst({
        where: { tenantId: actor.tenantId, code: dto.code }
      });
      if (existing) {
        throw new ConflictException(`An account with code ${dto.code} already exists.`);
      }
    }

    if (dto.parentAccountId) {
      await this.findAccountOrThrow(actor.tenantId, dto.parentAccountId);
    }

    let account: Account;
    try {
      account = await this.prisma.account.create({
        data: {
          tenantId: actor.tenantId,
          name: dto.name,
          code: dto.code ?? null,
          type: dto.type,
          parentAccountId: dto.parentAccountId ?? null,
          description: dto.description ?? null,
          openingBalance: dto.openingBalance ? new Prisma.Decimal(dto.openingBalance) : new Prisma.Decimal(0),
          currentBalance: dto.openingBalance ? new Prisma.Decimal(dto.openingBalance) : new Prisma.Decimal(0),
          isSystem: dto.isSystem ?? false
        }
      });
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
        throw new ConflictException("An account with this name already exists in your Mahallu.");
      }
      throw err;
    }

    await this.audit.record({
      actorUserId: actor.userId,
      tenantId: actor.tenantId,
      action: "accounting.account.create",
      targetType: "Account",
      targetId: account.id,
      metadata: { name: account.name, code: account.code, type: account.type },
      ipAddress: context.ipAddress,
      userAgent: context.userAgent
    });

    return account;
  }

  async updateAccount(actor: ActorContext, id: string, dto: UpdateAccountDto, context: RequestContext): Promise<Account> {
    const existing = await this.findAccountOrThrow(actor.tenantId, id);

    if (dto.code && dto.code !== existing.code) {
      const codeCheck = await this.prisma.account.findFirst({
        where: { tenantId: actor.tenantId, code: dto.code, NOT: { id } }
      });
      if (codeCheck) {
        throw new ConflictException(`An account with code ${dto.code} already exists.`);
      }
    }

    if (dto.parentAccountId) {
      if (dto.parentAccountId === id) {
        throw new BadRequestException("An account cannot be its own parent.");
      }
      await this.findAccountOrThrow(actor.tenantId, dto.parentAccountId);
    }

    const updated = await this.prisma.account.update({
      where: { id },
      data: {
        name: dto.name,
        code: dto.code,
        type: dto.type,
        parentAccountId: dto.parentAccountId,
        description: dto.description,
        isActive: dto.isActive
      }
    });

    await this.audit.record({
      actorUserId: actor.userId,
      tenantId: actor.tenantId,
      action: "accounting.account.update",
      targetType: "Account",
      targetId: id,
      metadata: { previous: { name: existing.name, code: existing.code }, updated: dto },
      ipAddress: context.ipAddress,
      userAgent: context.userAgent
    });

    return updated;
  }

  async removeAccount(actor: ActorContext, id: string, context: RequestContext): Promise<void> {
    const account = await this.findAccountOrThrow(actor.tenantId, id);
    if (account.isSystem) {
      throw new BadRequestException("System root accounts cannot be deactivated.");
    }

    // Check if referenced by vouchers or journal lines
    const [voucherCount, lineCount, childCount] = await Promise.all([
      this.prisma.voucher.count({ where: { accountId: id } }),
      this.prisma.journalEntryLine.count({ where: { accountId: id } }),
      this.prisma.account.count({ where: { parentAccountId: id, isActive: true } })
    ]);

    if (childCount > 0) {
      throw new BadRequestException("Cannot deactivate an account with active sub-accounts. Please reassign or deactivate child accounts first.");
    }

    await this.prisma.account.update({ where: { id }, data: { isActive: false } });

    await this.audit.record({
      actorUserId: actor.userId,
      tenantId: actor.tenantId,
      action: "accounting.account.deactivate",
      targetType: "Account",
      targetId: id,
      metadata: { name: account.name, voucherCount, lineCount },
      ipAddress: context.ipAddress,
      userAgent: context.userAgent
    });
  }

  // --- Financial Years -----------------------------------------------------

  async listFinancialYears(tenantId: string) {
    return this.prisma.financialYear.findMany({
      where: { tenantId },
      orderBy: { startDate: "desc" }
    });
  }

  async getCurrentFinancialYear(tenantId: string) {
    const fy = await this.prisma.financialYear.findFirst({
      where: { tenantId, isCurrent: true }
    });
    if (fy) return fy;
    return this.prisma.financialYear.findFirst({
      where: { tenantId, status: "OPEN" },
      orderBy: { startDate: "desc" }
    });
  }

  async createFinancialYear(actor: ActorContext, dto: CreateFinancialYearDto, context: RequestContext) {
    const startDate = new Date(dto.startDate);
    const endDate = new Date(dto.endDate);
    if (endDate <= startDate) {
      throw new BadRequestException("Financial year end date must be after start date.");
    }

    const fy = await this.prisma.financialYear.create({
      data: {
        tenantId: actor.tenantId,
        name: dto.name,
        startDate,
        endDate,
        status: "OPEN"
      }
    });

    await this.audit.record({
      actorUserId: actor.userId,
      tenantId: actor.tenantId,
      action: "accounting.financialYear.create",
      targetType: "FinancialYear",
      targetId: fy.id,
      metadata: { name: fy.name, startDate: dto.startDate, endDate: dto.endDate },
      ipAddress: context.ipAddress,
      userAgent: context.userAgent
    });

    return fy;
  }

  async closeFinancialYear(actor: ActorContext, id: string, context: RequestContext) {
    const fy = await this.prisma.financialYear.findFirst({ where: { id, tenantId: actor.tenantId } });
    if (!fy) throw new NotFoundException("Financial year not found");
    if (fy.status === "CLOSED") throw new BadRequestException("Financial year is already closed.");

    const updated = await this.prisma.financialYear.update({
      where: { id },
      data: {
        status: "CLOSED",
        isCurrent: false,
        closedAt: new Date(),
        closedBy: actor.userId
      }
    });

    await this.audit.record({
      actorUserId: actor.userId,
      tenantId: actor.tenantId,
      action: "accounting.financialYear.close",
      targetType: "FinancialYear",
      targetId: id,
      metadata: { name: fy.name },
      ipAddress: context.ipAddress,
      userAgent: context.userAgent
    });

    return updated;
  }

  async reopenFinancialYear(actor: ActorContext, id: string, context: RequestContext) {
    const fy = await this.prisma.financialYear.findFirst({ where: { id, tenantId: actor.tenantId } });
    if (!fy) throw new NotFoundException("Financial year not found");

    const updated = await this.prisma.financialYear.update({
      where: { id },
      data: { status: "OPEN", closedAt: null, closedBy: null }
    });

    await this.audit.record({
      actorUserId: actor.userId,
      tenantId: actor.tenantId,
      action: "accounting.financialYear.reopen",
      targetType: "FinancialYear",
      targetId: id,
      metadata: { name: fy.name },
      ipAddress: context.ipAddress,
      userAgent: context.userAgent
    });

    return updated;
  }

  async setCurrentFinancialYear(actor: ActorContext, id: string, context: RequestContext) {
    const fy = await this.prisma.financialYear.findFirst({ where: { id, tenantId: actor.tenantId } });
    if (!fy) throw new NotFoundException("Financial year not found");

    await this.prisma.$transaction([
      this.prisma.financialYear.updateMany({ where: { tenantId: actor.tenantId }, data: { isCurrent: false } }),
      this.prisma.financialYear.update({ where: { id }, data: { isCurrent: true } })
    ]);

    await this.audit.record({
      actorUserId: actor.userId,
      tenantId: actor.tenantId,
      action: "accounting.financialYear.setCurrent",
      targetType: "FinancialYear",
      targetId: id,
      metadata: { name: fy.name },
      ipAddress: context.ipAddress,
      userAgent: context.userAgent
    });

    return { success: true };
  }

  // --- Journal Entries -----------------------------------------------------

  async listJournalEntries(tenantId: string, page = 1, pageSize = 20, status?: string) {
    const where: Prisma.JournalEntryWhereInput = {
      tenantId,
      ...(status ? { status } : {})
    };

    const [entries, total] = await Promise.all([
      this.prisma.journalEntry.findMany({
        where,
        orderBy: { date: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
        include: {
          lines: {
            include: { account: { select: { id: true, name: true, code: true, type: true } } }
          },
          financialYear: { select: { id: true, name: true } }
        }
      }),
      this.prisma.journalEntry.count({ where })
    ]);

    return { entries, total };
  }

  async getJournalEntry(tenantId: string, id: string) {
    const entry = await this.prisma.journalEntry.findFirst({
      where: { id, tenantId },
      include: {
        lines: {
          include: { account: { select: { id: true, name: true, code: true, type: true } } }
        },
        financialYear: true
      }
    });
    if (!entry) throw new NotFoundException("Journal entry not found");
    return entry;
  }

  async createJournalEntry(actor: ActorContext, dto: CreateJournalEntryDto, context: RequestContext) {
    const entryDate = dto.date ? new Date(dto.date) : new Date();

    // Check financial year
    let fyId = dto.financialYearId;
    if (fyId) {
      const fy = await this.prisma.financialYear.findFirst({ where: { id: fyId, tenantId: actor.tenantId } });
      if (!fy) throw new NotFoundException("Specified financial year not found.");
      if (fy.status === "CLOSED") {
        throw new BadRequestException(`Cannot post journal entry: Financial Year ${fy.name} is closed.`);
      }
    } else {
      const activeFy = await this.getCurrentFinancialYear(actor.tenantId);
      if (activeFy) {
        if (activeFy.status === "CLOSED") {
          throw new BadRequestException("Current financial year is closed. Please open a financial year.");
        }
        fyId = activeFy.id;
      }
    }

    // Verify debit = credit
    let totalDebit = new Prisma.Decimal(0);
    let totalCredit = new Prisma.Decimal(0);

    for (const line of dto.lines) {
      const d = new Prisma.Decimal(line.debit);
      const c = new Prisma.Decimal(line.credit);
      if (d.lessThan(0) || c.lessThan(0)) {
        throw new BadRequestException("Debit and Credit amounts cannot be negative.");
      }
      if (d.isZero() && c.isZero()) {
        throw new BadRequestException("A journal line must have either a debit or credit amount.");
      }
      if (!d.isZero() && !c.isZero()) {
        throw new BadRequestException("A single journal line cannot have both debit and credit amounts.");
      }
      totalDebit = totalDebit.plus(d);
      totalCredit = totalCredit.plus(c);
    }

    if (!totalDebit.equals(totalCredit)) {
      throw new BadRequestException(
        `Journal entry does not balance: Total Debit (₹${totalDebit.toFixed(2)}) must equal Total Credit (₹${totalCredit.toFixed(2)}).`
      );
    }

    // Check account validity
    for (const line of dto.lines) {
      await this.findAccountOrThrow(actor.tenantId, line.accountId);
    }

    const entryNumber = await this.certificates.nextNumber(actor.tenantId, "JOURNAL_ENTRY", "JRN");

    const entry = await this.prisma.$transaction(async (tx) => {
      const created = await tx.journalEntry.create({
        data: {
          tenantId: actor.tenantId,
          entryNumber,
          financialYearId: fyId ?? null,
          date: entryDate,
          reference: dto.reference ?? null,
          description: dto.description,
          sourceType: dto.sourceType ?? "MANUAL",
          sourceId: dto.sourceId ?? null,
          status: "POSTED",
          totalDebit,
          totalCredit,
          postedAt: new Date(),
          postedBy: actor.userId,
          lines: {
            create: dto.lines.map((l) => ({
              accountId: l.accountId,
              debit: new Prisma.Decimal(l.debit),
              credit: new Prisma.Decimal(l.credit),
              description: l.description ?? null
            }))
          }
        },
        include: {
          lines: { include: { account: true } }
        }
      });

      // Update account current balances
      for (const line of dto.lines) {
        const d = new Prisma.Decimal(line.debit);
        const c = new Prisma.Decimal(line.credit);
        const netDelta = d.minus(c);
        await tx.account.update({
          where: { id: line.accountId },
          data: { currentBalance: { increment: netDelta } }
        });
      }

      return created;
    });

    await this.audit.record({
      actorUserId: actor.userId,
      tenantId: actor.tenantId,
      action: "accounting.journal.post",
      targetType: "JournalEntry",
      targetId: entry.id,
      metadata: { entryNumber, totalDebit: totalDebit.toFixed(2), description: dto.description },
      ipAddress: context.ipAddress,
      userAgent: context.userAgent
    });

    return entry;
  }

  async cancelJournalEntry(actor: ActorContext, id: string, reason: string | undefined, context: RequestContext) {
    const entry = await this.prisma.journalEntry.findFirst({
      where: { id, tenantId: actor.tenantId },
      include: { lines: true, financialYear: true }
    });
    if (!entry) throw new NotFoundException("Journal entry not found");
    if (entry.status === "CANCELLED") throw new BadRequestException("Journal entry is already cancelled.");
    if (entry.financialYear && entry.financialYear.status === "CLOSED") {
      throw new BadRequestException(`Cannot cancel entry: Financial Year ${entry.financialYear.name} is closed.`);
    }

    const cancelReason = reason?.trim() || "Cancelled by administrator";

    const updated = await this.prisma.$transaction(async (tx) => {
      // Reverse balance updates
      for (const line of entry.lines) {
        const netDelta = line.debit.minus(line.credit);
        await tx.account.update({
          where: { id: line.accountId },
          data: { currentBalance: { decrement: netDelta } }
        });
      }

      return tx.journalEntry.update({
        where: { id },
        data: {
          status: "CANCELLED",
          description: `${entry.description} [CANCELLED: ${cancelReason}]`
        }
      });
    });

    await this.audit.record({
      actorUserId: actor.userId,
      tenantId: actor.tenantId,
      action: "accounting.journal.cancel",
      targetType: "JournalEntry",
      targetId: id,
      metadata: { entryNumber: entry.entryNumber, reason: cancelReason },
      ipAddress: context.ipAddress,
      userAgent: context.userAgent
    });

    return updated;
  }

  // --- Reports & Ledgers ---------------------------------------------------

  /**
   * General Ledger: All journal entry lines for a specific account with running balance.
   */
  async getGeneralLedger(tenantId: string, accountId: string, startDate?: string, endDate?: string, financialYearId?: string) {
    const account = await this.findAccountOrThrow(tenantId, accountId);

    const dateFilter: Prisma.DateTimeFilter = {};
    if (startDate) dateFilter.gte = new Date(startDate);
    if (endDate) dateFilter.lte = new Date(endDate);

    const whereLines: Prisma.JournalEntryLineWhereInput = {
      accountId,
      journalEntry: {
        tenantId,
        status: "POSTED",
        ...(Object.keys(dateFilter).length > 0 ? { date: dateFilter } : {}),
        ...(financialYearId ? { financialYearId } : {})
      }
    };

    // Calculate opening balance prior to startDate
    let openingBalance = account.openingBalance;
    if (startDate) {
      const priorLines = await this.prisma.journalEntryLine.findMany({
        where: {
          accountId,
          journalEntry: {
            tenantId,
            status: "POSTED",
            date: { lt: new Date(startDate) }
          }
        }
      });
      for (const line of priorLines) {
        // For Assets & Expenses: normal balance is Debit (Debit increases, Credit decreases)
        // For Liabilities, Equity & Income: normal balance is Credit
        if (account.type === "ASSET" || account.type === "EXPENSE") {
          openingBalance = openingBalance.plus(line.debit).minus(line.credit);
        } else {
          openingBalance = openingBalance.plus(line.credit).minus(line.debit);
        }
      }
    }

    const lines = await this.prisma.journalEntryLine.findMany({
      where: whereLines,
      orderBy: [{ journalEntry: { date: "asc" } }, { createdAt: "asc" }],
      include: {
        journalEntry: {
          select: { id: true, entryNumber: true, date: true, reference: true, description: true, sourceType: true }
        }
      }
    });

    let runningBalance = openingBalance;
    let totalDebit = new Prisma.Decimal(0);
    let totalCredit = new Prisma.Decimal(0);

    const rows = lines.map((l) => {
      totalDebit = totalDebit.plus(l.debit);
      totalCredit = totalCredit.plus(l.credit);

      if (account.type === "ASSET" || account.type === "EXPENSE") {
        runningBalance = runningBalance.plus(l.debit).minus(l.credit);
      } else {
        runningBalance = runningBalance.plus(l.credit).minus(l.debit);
      }

      return {
        id: l.id,
        date: l.journalEntry.date,
        entryNumber: l.journalEntry.entryNumber,
        reference: l.journalEntry.reference,
        description: l.description || l.journalEntry.description,
        debit: l.debit.toFixed(2),
        credit: l.credit.toFixed(2),
        balance: runningBalance.toFixed(2)
      };
    });

    return {
      account: { id: account.id, name: account.name, code: account.code, type: account.type },
      openingBalance: openingBalance.toFixed(2),
      totalDebit: totalDebit.toFixed(2),
      totalCredit: totalCredit.toFixed(2),
      closingBalance: runningBalance.toFixed(2),
      rows
    };
  }

  /**
   * Cash Book: Chronological ledger of all cash transactions derived from Cash accounts.
   */
  async getCashBook(tenantId: string, startDate?: string, endDate?: string, financialYearId?: string) {
    // Find cash accounts (code 1100 or ASSET accounts matching cash)
    const cashAccounts = await this.prisma.account.findMany({
      where: {
        tenantId,
        isActive: true,
        type: "ASSET",
        OR: [
          { code: "1100" },
          { name: { contains: "Cash", mode: "insensitive" } }
        ]
      }
    });

    const cashAccountIds = cashAccounts.map((a) => a.id);
    if (cashAccountIds.length === 0) {
      return { rows: [], openingBalance: "0.00", totalReceipts: "0.00", totalPayments: "0.00", closingBalance: "0.00" };
    }

    const dateFilter: Prisma.DateTimeFilter = {};
    if (startDate) dateFilter.gte = new Date(startDate);
    if (endDate) dateFilter.lte = new Date(endDate);

    // Opening balance
    let openingBalance = cashAccounts.reduce((sum, a) => sum.plus(a.openingBalance), new Prisma.Decimal(0));
    if (startDate) {
      const priorLines = await this.prisma.journalEntryLine.findMany({
        where: {
          accountId: { in: cashAccountIds },
          journalEntry: {
            tenantId,
            status: "POSTED",
            date: { lt: new Date(startDate) }
          }
        }
      });
      for (const line of priorLines) {
        openingBalance = openingBalance.plus(line.debit).minus(line.credit);
      }
    }

    const lines = await this.prisma.journalEntryLine.findMany({
      where: {
        accountId: { in: cashAccountIds },
        journalEntry: {
          tenantId,
          status: "POSTED",
          ...(Object.keys(dateFilter).length > 0 ? { date: dateFilter } : {}),
          ...(financialYearId ? { financialYearId } : {})
        }
      },
      orderBy: [{ journalEntry: { date: "asc" } }, { createdAt: "asc" }],
      include: {
        journalEntry: {
          select: { id: true, entryNumber: true, date: true, reference: true, description: true, sourceType: true }
        },
        account: { select: { id: true, name: true, code: true } }
      }
    });

    let runningBalance = openingBalance;
    let totalReceipts = new Prisma.Decimal(0);
    let totalPayments = new Prisma.Decimal(0);

    const rows = lines.map((l) => {
      // Cash is an Asset: Debit is Receipt (Money In), Credit is Payment (Money Out)
      totalReceipts = totalReceipts.plus(l.debit);
      totalPayments = totalPayments.plus(l.credit);
      runningBalance = runningBalance.plus(l.debit).minus(l.credit);

      return {
        id: l.id,
        date: l.journalEntry.date,
        entryNumber: l.journalEntry.entryNumber,
        reference: l.journalEntry.reference,
        description: l.description || l.journalEntry.description,
        receipts: l.debit.isZero() ? null : l.debit.toFixed(2),
        payments: l.credit.isZero() ? null : l.credit.toFixed(2),
        balance: runningBalance.toFixed(2)
      };
    });

    return {
      openingBalance: openingBalance.toFixed(2),
      totalReceipts: totalReceipts.toFixed(2),
      totalPayments: totalPayments.toFixed(2),
      closingBalance: runningBalance.toFixed(2),
      rows
    };
  }

  /**
   * Bank Book: Specific bank account transaction ledger.
   */
  async getBankBook(tenantId: string, bankAccountId: string, startDate?: string, endDate?: string) {
    const bankAccount = await this.prisma.financeBankAccount.findFirst({
      where: { id: bankAccountId, tenantId }
    });
    if (!bankAccount) throw new NotFoundException("Bank account not found");

    if (!bankAccount.chartAccountId) {
      return {
        bankAccount,
        openingBalance: bankAccount.openingBalance.toFixed(2),
        deposits: "0.00",
        withdrawals: "0.00",
        closingBalance: bankAccount.currentBalance.toFixed(2),
        rows: []
      };
    }

    const ledger = await this.getGeneralLedger(tenantId, bankAccount.chartAccountId, startDate, endDate);

    const rows = ledger.rows.map((r) => ({
      ...r,
      deposits: r.debit !== "0.00" ? r.debit : null,
      withdrawals: r.credit !== "0.00" ? r.credit : null
    }));

    return {
      bankAccount: {
        id: bankAccount.id,
        accountName: bankAccount.accountName,
        bankName: bankAccount.bankName,
        accountNumber: bankAccount.accountNumber,
        ifsc: bankAccount.ifsc
      },
      openingBalance: ledger.openingBalance,
      deposits: ledger.totalDebit,
      withdrawals: ledger.totalCredit,
      closingBalance: ledger.closingBalance,
      rows
    };
  }

  /**
   * Trial Balance: List every account with its debit and credit balance.
   * Invariant: Total Debit == Total Credit.
   */
  async getTrialBalance(tenantId: string, financialYearId?: string, startDate?: string, endDate?: string) {
    const accounts = await this.prisma.account.findMany({
      where: { tenantId, isActive: true },
      orderBy: [{ code: "asc" }, { name: "asc" }]
    });

    const dateFilter: Prisma.DateTimeFilter = {};
    if (startDate) dateFilter.gte = new Date(startDate);
    if (endDate) dateFilter.lte = new Date(endDate);

    const where: Prisma.JournalEntryLineWhereInput = {
      journalEntry: {
        tenantId,
        status: "POSTED",
        ...(Object.keys(dateFilter).length > 0 ? { date: dateFilter } : {}),
        ...(financialYearId ? { financialYearId } : {})
      }
    };

    const lines = await this.prisma.journalEntryLine.findMany({
      where,
      select: { accountId: true, debit: true, credit: true }
    });

    const debitMap = new Map<string, Prisma.Decimal>();
    const creditMap = new Map<string, Prisma.Decimal>();

    lines.forEach((l) => {
      debitMap.set(l.accountId, (debitMap.get(l.accountId) ?? new Prisma.Decimal(0)).plus(l.debit));
      creditMap.set(l.accountId, (creditMap.get(l.accountId) ?? new Prisma.Decimal(0)).plus(l.credit));
    });

    let grandTotalDebit = new Prisma.Decimal(0);
    let grandTotalCredit = new Prisma.Decimal(0);

    const rows = accounts.map((acc) => {
      const d = debitMap.get(acc.id) ?? new Prisma.Decimal(0);
      const c = creditMap.get(acc.id) ?? new Prisma.Decimal(0);

      let balanceDebit = new Prisma.Decimal(0);
      let balanceCredit = new Prisma.Decimal(0);

      if (acc.type === "ASSET" || acc.type === "EXPENSE") {
        const net = d.plus(acc.openingBalance).minus(c);
        if (net.greaterThanOrEqualTo(0)) {
          balanceDebit = net;
        } else {
          balanceCredit = net.abs();
        }
      } else {
        const net = c.plus(acc.openingBalance).minus(d);
        if (net.greaterThanOrEqualTo(0)) {
          balanceCredit = net;
        } else {
          balanceDebit = net.abs();
        }
      }

      grandTotalDebit = grandTotalDebit.plus(balanceDebit);
      grandTotalCredit = grandTotalCredit.plus(balanceCredit);

      return {
        id: acc.id,
        code: acc.code ?? "—",
        name: acc.name,
        type: acc.type,
        debit: balanceDebit.isZero() ? "0.00" : balanceDebit.toFixed(2),
        credit: balanceCredit.isZero() ? "0.00" : balanceCredit.toFixed(2)
      };
    }).filter((r) => r.debit !== "0.00" || r.credit !== "0.00");

    const isBalanced = grandTotalDebit.equals(grandTotalCredit);

    return {
      rows,
      totalDebit: grandTotalDebit.toFixed(2),
      totalCredit: grandTotalCredit.toFixed(2),
      isBalanced
    };
  }

  /**
   * Receipt & Payment Account: Summarized receipts and payments grouped by category.
   */
  async getReceiptAndPaymentAccount(tenantId: string, financialYearId?: string, startDate?: string, endDate?: string) {
    const cashBook = await this.getCashBook(tenantId, startDate, endDate, financialYearId);

    // Group vouchers / entries by collection category and expense category
    const collections = await this.prisma.financeCollection.groupBy({
      by: ["categoryId"],
      where: {
        tenantId,
        status: "COMPLETED",
        ...(startDate || endDate ? { date: { gte: startDate ? new Date(startDate) : undefined, lte: endDate ? new Date(endDate) : undefined } } : {})
      },
      _sum: { amount: true }
    });

    const categoryIds = collections.map((c) => c.categoryId).filter((id): id is string => !!id);
    const catDetails = await this.prisma.collectionCategory.findMany({
      where: { id: { in: categoryIds } }
    });
    const catNameMap = new Map(catDetails.map((c) => [c.id, c.name]));

    const receipts = collections.map((c) => ({
      category: c.categoryId ? (catNameMap.get(c.categoryId) ?? "Uncategorized Collection") : "General Inflow",
      amount: c._sum.amount?.toFixed(2) ?? "0.00"
    }));

    const vouchers = await this.prisma.voucher.groupBy({
      by: ["expenseCategoryId"],
      where: {
        tenantId,
        type: "PAYMENT",
        status: "PAID",
        ...(startDate || endDate ? { date: { gte: startDate ? new Date(startDate) : undefined, lte: endDate ? new Date(endDate) : undefined } } : {})
      },
      _sum: { amount: true }
    });

    const expCatIds = vouchers.map((v) => v.expenseCategoryId).filter((id): id is string => !!id);
    const expCatDetails = await this.prisma.expenseCategory.findMany({
      where: { id: { in: expCatIds } }
    });
    const expCatNameMap = new Map(expCatDetails.map((e) => [e.id, e.name]));

    const payments = vouchers.map((v) => ({
      category: v.expenseCategoryId ? (expCatNameMap.get(v.expenseCategoryId) ?? "Uncategorized Expense") : "General Payment",
      amount: v._sum.amount?.toFixed(2) ?? "0.00"
    }));

    return {
      openingBalance: cashBook.openingBalance,
      receipts,
      payments,
      totalReceipts: cashBook.totalReceipts,
      totalPayments: cashBook.totalPayments,
      closingBalance: cashBook.closingBalance
    };
  }

  /**
   * Income & Expenditure Account: Operating revenues vs Operating expenses with Surplus/Deficit.
   */
  async getIncomeAndExpenditure(tenantId: string, financialYearId?: string, startDate?: string, endDate?: string) {
    const incomeAccounts = await this.prisma.account.findMany({
      where: { tenantId, isActive: true, type: "INCOME" },
      orderBy: [{ code: "asc" }, { name: "asc" }]
    });

    const expenseAccounts = await this.prisma.account.findMany({
      where: { tenantId, isActive: true, type: "EXPENSE" },
      orderBy: [{ code: "asc" }, { name: "asc" }]
    });

    const dateFilter: Prisma.DateTimeFilter = {};
    if (startDate) dateFilter.gte = new Date(startDate);
    if (endDate) dateFilter.lte = new Date(endDate);

    const allAccountIds = [...incomeAccounts, ...expenseAccounts].map((a) => a.id);
    const lines = await this.prisma.journalEntryLine.findMany({
      where: {
        accountId: { in: allAccountIds },
        journalEntry: {
          tenantId,
          status: "POSTED",
          ...(Object.keys(dateFilter).length > 0 ? { date: dateFilter } : {}),
          ...(financialYearId ? { financialYearId } : {})
        }
      },
      select: { accountId: true, debit: true, credit: true }
    });

    const netMap = new Map<string, Prisma.Decimal>();
    lines.forEach((l) => {
      const current = netMap.get(l.accountId) ?? new Prisma.Decimal(0);
      netMap.set(l.accountId, current.plus(l.credit).minus(l.debit));
    });

    let totalIncome = new Prisma.Decimal(0);
    const incomeRows = incomeAccounts.map((a) => {
      const net = netMap.get(a.id) ?? new Prisma.Decimal(0);
      const amount = net.greaterThan(0) ? net : new Prisma.Decimal(0);
      totalIncome = totalIncome.plus(amount);
      return { id: a.id, code: a.code, name: a.name, amount: amount.toFixed(2) };
    });

    let totalExpense = new Prisma.Decimal(0);
    const expenseRows = expenseAccounts.map((a) => {
      const net = (netMap.get(a.id) ?? new Prisma.Decimal(0)).negated();
      const amount = net.greaterThan(0) ? net : new Prisma.Decimal(0);
      totalExpense = totalExpense.plus(amount);
      return { id: a.id, code: a.code, name: a.name, amount: amount.toFixed(2) };
    });

    const surplusOrDeficit = totalIncome.minus(totalExpense);

    return {
      incomes: incomeRows,
      expenses: expenseRows,
      totalIncome: totalIncome.toFixed(2),
      totalExpense: totalExpense.toFixed(2),
      surplusOrDeficit: surplusOrDeficit.toFixed(2),
      isSurplus: surplusOrDeficit.greaterThanOrEqualTo(0)
    };
  }

  /**
   * Balance Sheet: Assets, Liabilities, and Equity/Funds.
   * Invariant: Assets = Liabilities + Equity + Net Surplus.
   */
  async getBalanceSheet(tenantId: string, asOfDate?: string, financialYearId?: string) {
    const assets = await this.prisma.account.findMany({
      where: { tenantId, isActive: true, type: "ASSET" },
      orderBy: [{ code: "asc" }, { name: "asc" }]
    });

    const liabilities = await this.prisma.account.findMany({
      where: { tenantId, isActive: true, type: "LIABILITY" },
      orderBy: [{ code: "asc" }, { name: "asc" }]
    });

    const equity = await this.prisma.account.findMany({
      where: { tenantId, isActive: true, type: "EQUITY" },
      orderBy: [{ code: "asc" }, { name: "asc" }]
    });

    const targetDate = asOfDate ? new Date(asOfDate) : new Date();

    const allAccounts = [...assets, ...liabilities, ...equity];
    const lines = await this.prisma.journalEntryLine.findMany({
      where: {
        accountId: { in: allAccounts.map((a) => a.id) },
        journalEntry: {
          tenantId,
          status: "POSTED",
          date: { lte: targetDate },
          ...(financialYearId ? { financialYearId } : {})
        }
      },
      select: { accountId: true, debit: true, credit: true }
    });

    const debitMap = new Map<string, Prisma.Decimal>();
    const creditMap = new Map<string, Prisma.Decimal>();
    lines.forEach((l) => {
      debitMap.set(l.accountId, (debitMap.get(l.accountId) ?? new Prisma.Decimal(0)).plus(l.debit));
      creditMap.set(l.accountId, (creditMap.get(l.accountId) ?? new Prisma.Decimal(0)).plus(l.credit));
    });

    let totalAssets = new Prisma.Decimal(0);
    const assetRows = assets.map((a) => {
      const d = debitMap.get(a.id) ?? new Prisma.Decimal(0);
      const c = creditMap.get(a.id) ?? new Prisma.Decimal(0);
      const val = a.openingBalance.plus(d).minus(c);
      totalAssets = totalAssets.plus(val);
      return { id: a.id, code: a.code, name: a.name, amount: val.toFixed(2) };
    });

    let totalLiabilities = new Prisma.Decimal(0);
    const liabilityRows = liabilities.map((a) => {
      const d = debitMap.get(a.id) ?? new Prisma.Decimal(0);
      const c = creditMap.get(a.id) ?? new Prisma.Decimal(0);
      const val = a.openingBalance.plus(c).minus(d);
      totalLiabilities = totalLiabilities.plus(val);
      return { id: a.id, code: a.code, name: a.name, amount: val.toFixed(2) };
    });

    let totalEquity = new Prisma.Decimal(0);
    const equityRows = equity.map((a) => {
      const d = debitMap.get(a.id) ?? new Prisma.Decimal(0);
      const c = creditMap.get(a.id) ?? new Prisma.Decimal(0);
      const val = a.openingBalance.plus(c).minus(d);
      totalEquity = totalEquity.plus(val);
      return { id: a.id, code: a.code, name: a.name, amount: val.toFixed(2) };
    });

    // Calculate current period surplus
    const incomeExpense = await this.getIncomeAndExpenditure(tenantId, financialYearId, undefined, asOfDate);
    const currentSurplus = new Prisma.Decimal(incomeExpense.surplusOrDeficit);
    const totalLiabilitiesAndEquity = totalLiabilities.plus(totalEquity).plus(currentSurplus);

    return {
      assets: assetRows,
      liabilities: liabilityRows,
      equity: equityRows,
      currentPeriodSurplus: currentSurplus.toFixed(2),
      totalAssets: totalAssets.toFixed(2),
      totalLiabilities: totalLiabilities.toFixed(2),
      totalEquity: totalEquity.toFixed(2),
      totalLiabilitiesAndEquity: totalLiabilitiesAndEquity.toFixed(2),
      isBalanced: totalAssets.equals(totalLiabilitiesAndEquity)
    };
  }
}
