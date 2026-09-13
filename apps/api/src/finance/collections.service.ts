import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { Prisma, type FinanceCollection, type FinanceReceipt } from "@mahalle/database";
import { PrismaService } from "../database/prisma.service";
import { AuditService } from "../audit/audit.service";
import { CertificateService } from "../registers/certificates/certificate.service";
import { FinanceSettingsService } from "./finance-settings.service";
import { AccountingService } from "./accounting.service";
import type { CreateCollectionDto } from "./dto/create-collection.dto";

interface RequestContext {
  ipAddress?: string;
  userAgent?: string;
}

interface ActorContext {
  userId: string;
  tenantId: string;
}

@Injectable()
export class CollectionsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
    private readonly certificates: CertificateService,
    private readonly settingsService: FinanceSettingsService,
    private readonly accountingService: AccountingService
  ) {}

  async listCollections(
    tenantId: string,
    params: {
      type?: string;
      categoryId?: string;
      familyId?: string;
      memberId?: string;
      divisionId?: string;
      startDate?: string;
      endDate?: string;
      search?: string;
      page?: number;
      pageSize?: number;
    }
  ) {
    const page = params.page ?? 1;
    const pageSize = params.pageSize ?? 20;

    const where: Prisma.FinanceCollectionWhereInput = {
      tenantId,
      ...(params.type ? { type: params.type } : {}),
      ...(params.categoryId ? { categoryId: params.categoryId } : {}),
      ...(params.familyId ? { familyId: params.familyId } : {}),
      ...(params.memberId ? { memberId: params.memberId } : {}),
      ...(params.startDate || params.endDate
        ? {
            date: {
              gte: params.startDate ? new Date(params.startDate) : undefined,
              lte: params.endDate ? new Date(params.endDate) : undefined
            }
          }
        : {}),
      ...(params.divisionId
        ? {
            family: { house: { divisionId: params.divisionId } }
          }
        : {}),
      ...(params.search
        ? {
            OR: [
              { collectionNumber: { contains: params.search, mode: "insensitive" } },
              { donorName: { contains: params.search, mode: "insensitive" } },
              { collectorName: { contains: params.search, mode: "insensitive" } },
              { reference: { contains: params.search, mode: "insensitive" } },
              { description: { contains: params.search, mode: "insensitive" } },
              { family: { name: { contains: params.search, mode: "insensitive" } } },
              { member: { fullName: { contains: params.search, mode: "insensitive" } } }
            ]
          }
        : {})
    };

    const [collections, total] = await Promise.all([
      this.prisma.financeCollection.findMany({
        where,
        orderBy: { date: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
        include: {
          category: { select: { id: true, name: true, code: true } },
          family: { select: { id: true, name: true, familyNumber: true, house: { select: { displayNumber: true } } } },
          member: { select: { id: true, fullName: true, phone: true } },
          paymentMethodRef: { select: { id: true, name: true, code: true } },
          bankAccount: { select: { id: true, accountName: true, bankName: true } },
          receipt: { select: { id: true, receiptNumber: true, status: true } }
        }
      }),
      this.prisma.financeCollection.count({ where })
    ]);

    return { collections, total };
  }

  async getCollection(tenantId: string, id: string) {
    const collection = await this.prisma.financeCollection.findFirst({
      where: { id, tenantId },
      include: {
        category: true,
        family: { include: { house: true } },
        member: true,
        paymentMethodRef: true,
        bankAccount: true,
        receipt: true,
        journalEntry: { include: { lines: { include: { account: true } } } }
      }
    });
    if (!collection) throw new NotFoundException("Collection record not found");
    return collection;
  }

  async createCollection(actor: ActorContext, dto: CreateCollectionDto, context: RequestContext) {
    const amount = new Prisma.Decimal(dto.amount);
    if (amount.lessThanOrEqualTo(0)) {
      throw new BadRequestException("Collection amount must be greater than zero.");
    }

    const settings = await this.settingsService.getSettings(actor.tenantId);
    const date = dto.date ? new Date(dto.date) : new Date();

    // Determine category and income account
    let incomeAccountId: string | null = null;
    let categoryName = "General Collection";

    if (dto.categoryId) {
      const cat = await this.prisma.collectionCategory.findFirst({
        where: { id: dto.categoryId, tenantId: actor.tenantId }
      });
      if (cat) {
        incomeAccountId = cat.incomeAccountId;
        categoryName = cat.name;
      }
    }

    if (!incomeAccountId) {
      incomeAccountId = settings.defaultCollectionIncomeAccountId;
    }

    // Fallback: search for income account if still missing
    if (!incomeAccountId) {
      const defaultAcc = await this.prisma.account.findFirst({
        where: { tenantId: actor.tenantId, type: "INCOME", isActive: true }
      });
      incomeAccountId = defaultAcc?.id ?? null;
    }

    // Determine debit account (Cash vs Bank)
    let debitAccountId = settings.defaultCashAccountId;
    if (dto.bankAccountId) {
      const bank = await this.prisma.financeBankAccount.findFirst({
        where: { id: dto.bankAccountId, tenantId: actor.tenantId }
      });
      if (bank?.chartAccountId) {
        debitAccountId = bank.chartAccountId;
      } else if (settings.defaultBankAccountId) {
        debitAccountId = settings.defaultBankAccountId;
      }
    } else if (dto.paymentMethod === "Bank Transfer" || dto.paymentMethod === "UPI") {
      if (settings.defaultBankAccountId) {
        debitAccountId = settings.defaultBankAccountId;
      }
    }

    if (!debitAccountId) {
      const defaultCash = await this.prisma.account.findFirst({
        where: { tenantId: actor.tenantId, type: "ASSET", isActive: true }
      });
      debitAccountId = defaultCash?.id ?? null;
    }

    // Generate collection number and receipt number
    const collectionNumber = await this.certificates.nextNumber(actor.tenantId, "COLLECTION", "COL");
    const prefix = settings.receiptPrefix || "RCP";
    const receiptNumber = await this.certificates.nextNumber(actor.tenantId, "RECEIPT", prefix);

    // Identify party name for receipt
    let receivedFrom = dto.donorName || "Anonymous Donor";
    if (dto.memberId) {
      const mem = await this.prisma.member.findFirst({ where: { id: dto.memberId, tenantId: actor.tenantId } });
      if (mem) receivedFrom = mem.fullName;
    } else if (dto.familyId) {
      const fam = await this.prisma.family.findFirst({ where: { id: dto.familyId, tenantId: actor.tenantId } });
      if (fam) receivedFrom = `Family: ${fam.name}`;
    }

    // Atomic transaction: Collection + Receipt + Journal Entry
    const result = await this.prisma.$transaction(async (tx) => {
      // 1. Create Receipt
      const receipt = await tx.financeReceipt.create({
        data: {
          tenantId: actor.tenantId,
          receiptNumber,
          date,
          receivedFrom,
          categoryName,
          amount,
          paymentMethod: dto.paymentMethod ?? "Cash",
          reference: dto.reference ?? null,
          description: dto.description ?? settings.defaultCollectionDescription ?? null,
          recordedBy: actor.userId,
          status: "ACTIVE"
        }
      });

      // 2. Create Journal Entry if accounts are mapped
      let journalEntryId: string | null = null;
      if (debitAccountId && incomeAccountId) {
        const entryNumber = await this.certificates.nextNumber(actor.tenantId, "JOURNAL_ENTRY", "JRN");
        const activeFy = await this.accountingService.getCurrentFinancialYear(actor.tenantId);

        const journal = await tx.journalEntry.create({
          data: {
            tenantId: actor.tenantId,
            entryNumber,
            financialYearId: activeFy?.id ?? null,
            date,
            reference: receiptNumber,
            description: `${categoryName} from ${receivedFrom}`,
            sourceType: "COLLECTION",
            status: "POSTED",
            totalDebit: amount,
            totalCredit: amount,
            postedAt: new Date(),
            postedBy: actor.userId,
            lines: {
              create: [
                { accountId: debitAccountId, debit: amount, credit: new Prisma.Decimal(0), description: `Received via ${dto.paymentMethod ?? "Cash"}` },
                { accountId: incomeAccountId, debit: new Prisma.Decimal(0), credit: amount, description: categoryName }
              ]
            }
          }
        });
        journalEntryId = journal.id;

        // Update account balances
        await tx.account.update({ where: { id: debitAccountId }, data: { currentBalance: { increment: amount } } });
        await tx.account.update({ where: { id: incomeAccountId }, data: { currentBalance: { increment: amount } } });

        if (dto.bankAccountId) {
          await tx.financeBankAccount.update({
            where: { id: dto.bankAccountId },
            data: { currentBalance: { increment: amount } }
          });
        }
      }

      // 3. Create Collection
      const collection = await tx.financeCollection.create({
        data: {
          tenantId: actor.tenantId,
          collectionNumber,
          type: dto.type,
          categoryId: dto.categoryId ?? null,
          familyId: dto.familyId ?? null,
          memberId: dto.memberId ?? null,
          donorName: dto.donorName ?? null,
          donorPhone: dto.donorPhone ?? null,
          donorAddress: dto.donorAddress ?? null,
          collectorName: dto.collectorName ?? null,
          amount,
          paymentMethodId: dto.paymentMethodId ?? null,
          paymentMethod: dto.paymentMethod ?? "Cash",
          bankAccountId: dto.bankAccountId ?? null,
          date,
          reference: dto.reference ?? null,
          description: dto.description ?? null,
          notes: dto.notes ?? null,
          status: "COMPLETED",
          receiptId: receipt.id,
          journalEntryId
        },
        include: {
          category: true,
          receipt: true,
          family: true,
          member: true
        }
      });

      // 4. Update Due if this was settling a member/family due
      if (dto.memberId) {
        const matchingDue = await tx.due.findFirst({
          where: { tenantId: actor.tenantId, memberId: dto.memberId, status: "PENDING" },
          orderBy: { dueDate: "asc" }
        });
        if (matchingDue && matchingDue.amount.equals(amount)) {
          await tx.due.update({
            where: { id: matchingDue.id },
            data: { status: "PAID", paidAmount: amount, outstandingAmount: new Prisma.Decimal(0) }
          });
        }
      }

      return collection;
    });

    await this.audit.record({
      actorUserId: actor.userId,
      tenantId: actor.tenantId,
      action: "collections.create",
      targetType: "FinanceCollection",
      targetId: result.id,
      metadata: { collectionNumber, receiptNumber, amount: amount.toFixed(2), type: dto.type },
      ipAddress: context.ipAddress,
      userAgent: context.userAgent
    });

    return result;
  }

  async cancelCollection(actor: ActorContext, id: string, reason: string | undefined, context: RequestContext) {
    const collection = await this.prisma.financeCollection.findFirst({
      where: { id, tenantId: actor.tenantId },
      include: { receipt: true, journalEntry: { include: { lines: true } } }
    });
    if (!collection) throw new NotFoundException("Collection not found");
    if (collection.status === "CANCELLED") throw new BadRequestException("Collection is already cancelled.");

    const cancelReason = reason?.trim() || "Cancelled by administrator";

    await this.prisma.$transaction(async (tx) => {
      // 1. Cancel Collection
      await tx.financeCollection.update({
        where: { id },
        data: { status: "CANCELLED", notes: `${collection.notes ?? ""} [CANCELLED: ${cancelReason}]` }
      });

      // 2. Cancel Receipt
      if (collection.receiptId) {
        await tx.financeReceipt.update({
          where: { id: collection.receiptId },
          data: {
            status: "CANCELLED",
            cancelledAt: new Date(),
            cancelledReason: cancelReason,
            cancelledBy: actor.userId
          }
        });
      }

      // 3. Cancel Journal Entry & Reverse Balances
      if (collection.journalEntry) {
        for (const line of collection.journalEntry.lines) {
          const net = line.debit.minus(line.credit);
          await tx.account.update({
            where: { id: line.accountId },
            data: { currentBalance: { decrement: net } }
          });
        }
        await tx.journalEntry.update({
          where: { id: collection.journalEntry.id },
          data: { status: "CANCELLED", description: `${collection.journalEntry.description} [CANCELLED: ${cancelReason}]` }
        });
      }

      if (collection.bankAccountId) {
        await tx.financeBankAccount.update({
          where: { id: collection.bankAccountId },
          data: { currentBalance: { decrement: collection.amount } }
        });
      }
    });

    await this.audit.record({
      actorUserId: actor.userId,
      tenantId: actor.tenantId,
      action: "collections.cancel",
      targetType: "FinanceCollection",
      targetId: id,
      metadata: { collectionNumber: collection.collectionNumber, reason: cancelReason },
      ipAddress: context.ipAddress,
      userAgent: context.userAgent
    });

    return { success: true };
  }

  async cancelReceipt(actor: ActorContext, receiptId: string, reason: string | undefined, context: RequestContext) {
    const receipt = await this.prisma.financeReceipt.findFirst({
      where: { id: receiptId, tenantId: actor.tenantId }
    });
    if (!receipt) throw new NotFoundException("Receipt not found");
    if (receipt.status === "CANCELLED") throw new BadRequestException("Receipt is already cancelled.");

    const collection = await this.prisma.financeCollection.findFirst({
      where: { receiptId, tenantId: actor.tenantId }
    });
    if (collection) {
      return this.cancelCollection(actor, collection.id, reason, context);
    }

    const cancelReason = reason?.trim() || "Cancelled by administrator";
    await this.prisma.financeReceipt.update({
      where: { id: receiptId },
      data: {
        status: "CANCELLED",
        cancelledAt: new Date(),
        cancelledReason: cancelReason,
        cancelledBy: actor.userId
      }
    });

    await this.audit.record({
      actorUserId: actor.userId,
      tenantId: actor.tenantId,
      action: "receipts.cancel",
      targetType: "FinanceReceipt",
      targetId: receiptId,
      metadata: { receiptNumber: receipt.receiptNumber, reason: cancelReason },
      ipAddress: context.ipAddress,
      userAgent: context.userAgent
    });

    return { success: true };
  }

  // --- Receipts Register ---------------------------------------------------

  async listReceipts(tenantId: string, page = 1, pageSize = 20, search?: string) {
    const where: Prisma.FinanceReceiptWhereInput = {
      tenantId,
      ...(search
        ? {
            OR: [
              { receiptNumber: { contains: search, mode: "insensitive" } },
              { receivedFrom: { contains: search, mode: "insensitive" } },
              { categoryName: { contains: search, mode: "insensitive" } },
              { reference: { contains: search, mode: "insensitive" } }
            ]
          }
        : {})
    };

    const [receipts, total] = await Promise.all([
      this.prisma.financeReceipt.findMany({
        where,
        orderBy: { date: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
        include: {
          collection: {
            select: { id: true, type: true, collectionNumber: true, familyId: true, memberId: true }
          }
        }
      }),
      this.prisma.financeReceipt.count({ where })
    ]);

    return { receipts, total };
  }

  async getReceipt(tenantId: string, id: string) {
    const receipt = await this.prisma.financeReceipt.findFirst({
      where: { id, tenantId },
      include: {
        collection: {
          include: {
            family: { include: { house: true } },
            member: true,
            category: true
          }
        }
      }
    });
    if (!receipt) throw new NotFoundException("Receipt not found");
    return receipt;
  }

  // --- Session Summaries ----------------------------------------------------

  async getFridayCollectionSummary(tenantId: string, date: string) {
    const start = new Date(date);
    start.setHours(0, 0, 0, 0);
    const end = new Date(date);
    end.setHours(23, 59, 59, 999);

    const collections = await this.prisma.financeCollection.findMany({
      where: {
        tenantId,
        type: { in: ["FRIDAY_COLLECTION", "DAY_COLLECTION"] },
        date: { gte: start, lte: end },
        status: "COMPLETED"
      }
    });

    let totalAmount = new Prisma.Decimal(0);
    const byMethod: Record<string, Prisma.Decimal> = {};

    collections.forEach((c) => {
      totalAmount = totalAmount.plus(c.amount);
      const method = c.paymentMethod || "Cash";
      byMethod[method] = (byMethod[method] ?? new Prisma.Decimal(0)).plus(c.amount);
    });

    const breakdown = Object.entries(byMethod).map(([method, amt]) => ({
      method,
      amount: amt.toFixed(2)
    }));

    return {
      date,
      count: collections.length,
      totalAmount: totalAmount.toFixed(2),
      breakdown
    };
  }

  async getFamilyCollectionHistory(tenantId: string, familyId: string) {
    const [collections, dues] = await Promise.all([
      this.prisma.financeCollection.findMany({
        where: { tenantId, familyId, status: "COMPLETED" },
        orderBy: { date: "desc" },
        include: { receipt: true, category: true }
      }),
      this.prisma.due.findMany({
        where: { tenantId, familyId },
        orderBy: { dueDate: "desc" }
      })
    ]);

    const totalPaid = collections.reduce((sum, c) => sum.plus(c.amount), new Prisma.Decimal(0));
    const outstandingDues = dues
      .filter((d) => d.status === "PENDING")
      .reduce((sum, d) => sum.plus(d.amount.minus(d.paidAmount)), new Prisma.Decimal(0));

    return {
      totalPaid: totalPaid.toFixed(2),
      outstandingAmount: outstandingDues.toFixed(2),
      collections,
      dues
    };
  }
}
