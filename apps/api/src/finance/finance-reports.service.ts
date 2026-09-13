import { Injectable } from "@nestjs/common";
import { Prisma } from "@mahalle/database";
import { PrismaService } from "../database/prisma.service";
import { AccountingService } from "./accounting.service";

@Injectable()
export class FinanceReportsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly accountingService: AccountingService
  ) {}

  // --- Area / Division Analysis --------------------------------------------

  async getAreaWiseFinance(tenantId: string) {
    const divisions = await this.prisma.tenantDivision.findMany({
      where: { tenantId },
      include: {
        houses: {
          include: {
            families: {
              include: {
                financeCollections: { where: { status: "COMPLETED" }, select: { amount: true } },
                financeDues: { where: { status: "PENDING" }, select: { amount: true, paidAmount: true } }
              }
            }
          }
        }
      }
    });

    const rows = divisions.map((div) => {
      let totalCollected = new Prisma.Decimal(0);
      let totalOutstandingDues = new Prisma.Decimal(0);
      let familyCount = 0;

      div.houses.forEach((h) => {
        h.families.forEach((f) => {
          familyCount++;
          f.financeCollections.forEach((c) => {
            totalCollected = totalCollected.plus(c.amount);
          });
          f.financeDues.forEach((d) => {
            totalOutstandingDues = totalOutstandingDues.plus(d.amount.minus(d.paidAmount));
          });
        });
      });

      return {
        divisionId: div.id,
        divisionName: div.name,
        divisionCode: div.code,
        familyCount,
        totalCollected: totalCollected.toFixed(2),
        totalOutstandingDues: totalOutstandingDues.toFixed(2)
      };
    });

    return rows;
  }

  // --- Collection Report ---------------------------------------------------

  async getCollectionReport(
    tenantId: string,
    filters: {
      startDate?: string;
      endDate?: string;
      categoryId?: string;
      divisionId?: string;
      paymentMethodId?: string;
    }
  ) {
    const where: Prisma.FinanceCollectionWhereInput = {
      tenantId,
      status: "COMPLETED",
      ...(filters.categoryId ? { categoryId: filters.categoryId } : {}),
      ...(filters.paymentMethodId ? { paymentMethodId: filters.paymentMethodId } : {}),
      ...(filters.startDate || filters.endDate
        ? {
            date: {
              gte: filters.startDate ? new Date(filters.startDate) : undefined,
              lte: filters.endDate ? new Date(filters.endDate) : undefined
            }
          }
        : {}),
      ...(filters.divisionId ? { family: { house: { divisionId: filters.divisionId } } } : {})
    };

    const collections = await this.prisma.financeCollection.findMany({
      where,
      orderBy: { date: "desc" },
      include: {
        category: { select: { id: true, name: true } },
        family: { select: { id: true, name: true, familyNumber: true } },
        member: { select: { id: true, fullName: true } }
      }
    });

    let totalAmount = new Prisma.Decimal(0);
    const byCategory: Record<string, Prisma.Decimal> = {};

    const rows = collections.map((c) => {
      totalAmount = totalAmount.plus(c.amount);
      const catName = c.category?.name || "General Collection";
      byCategory[catName] = (byCategory[catName] ?? new Prisma.Decimal(0)).plus(c.amount);

      return {
        id: c.id,
        collectionNumber: c.collectionNumber,
        date: c.date,
        type: c.type,
        category: catName,
        contributor: c.family?.name ? `Family: ${c.family.name}` : c.member?.fullName || c.donorName || "Anonymous",
        paymentMethod: c.paymentMethod || "Cash",
        amount: c.amount.toFixed(2)
      };
    });

    const categorySummary = Object.entries(byCategory).map(([category, amt]) => ({
      category,
      amount: amt.toFixed(2)
    }));

    return {
      totalAmount: totalAmount.toFixed(2),
      count: collections.length,
      categorySummary,
      rows
    };
  }

  // --- Payment / Expense Report --------------------------------------------

  async getExpenseReport(
    tenantId: string,
    filters: {
      startDate?: string;
      endDate?: string;
      expenseCategoryId?: string;
      bankAccountId?: string;
    }
  ) {
    const where: Prisma.VoucherWhereInput = {
      tenantId,
      type: "PAYMENT",
      status: "PAID",
      ...(filters.expenseCategoryId ? { expenseCategoryId: filters.expenseCategoryId } : {}),
      ...(filters.bankAccountId ? { bankAccountId: filters.bankAccountId } : {}),
      ...(filters.startDate || filters.endDate
        ? {
            date: {
              gte: filters.startDate ? new Date(filters.startDate) : undefined,
              lte: filters.endDate ? new Date(filters.endDate) : undefined
            }
          }
        : {})
    };

    const vouchers = await this.prisma.voucher.findMany({
      where,
      orderBy: { date: "desc" },
      include: {
        expenseCategory: { select: { id: true, name: true } },
        bankAccount: { select: { id: true, accountName: true } }
      }
    });

    let totalAmount = new Prisma.Decimal(0);
    const byCategory: Record<string, Prisma.Decimal> = {};

    const rows = vouchers.map((v) => {
      totalAmount = totalAmount.plus(v.amount);
      const catName = v.expenseCategory?.name || "General Expense";
      byCategory[catName] = (byCategory[catName] ?? new Prisma.Decimal(0)).plus(v.amount);

      return {
        id: v.id,
        voucherNumber: v.voucherNumber,
        date: v.date,
        category: catName,
        payee: v.payeeName || v.partyName || "Payee",
        paymentMethod: v.paymentMethod || "Cash",
        amount: v.amount.toFixed(2)
      };
    });

    const categorySummary = Object.entries(byCategory).map(([category, amt]) => ({
      category,
      amount: amt.toFixed(2)
    }));

    return {
      totalAmount: totalAmount.toFixed(2),
      count: vouchers.length,
      categorySummary,
      rows
    };
  }

  // --- Donations Report ----------------------------------------------------

  async getDonationReport(tenantId: string, startDate?: string, endDate?: string) {
    return this.getCollectionReport(tenantId, { startDate, endDate });
  }

  // --- Dues & Arrears Report -----------------------------------------------

  async getDuesReport(tenantId: string, filters: { divisionId?: string; categoryId?: string; status?: "PENDING" | "PAID" }) {
    const where: Prisma.DueWhereInput = {
      tenantId,
      ...(filters.status ? { status: filters.status } : {}),
      ...(filters.categoryId ? { categoryId: filters.categoryId } : {}),
      ...(filters.divisionId ? { family: { house: { divisionId: filters.divisionId } } } : {})
    };

    const dues = await this.prisma.due.findMany({
      where,
      orderBy: { dueDate: "desc" },
      include: {
        member: { select: { id: true, fullName: true, phone: true } },
        family: { select: { id: true, name: true, house: { select: { displayNumber: true, division: { select: { name: true } } } } } },
        category: { select: { id: true, name: true } }
      }
    });

    let totalExpected = new Prisma.Decimal(0);
    let totalPaid = new Prisma.Decimal(0);
    let totalOutstanding = new Prisma.Decimal(0);

    const rows = dues.map((d) => {
      totalExpected = totalExpected.plus(d.amount);
      totalPaid = totalPaid.plus(d.paidAmount);
      const out = d.amount.minus(d.paidAmount);
      totalOutstanding = totalOutstanding.plus(out);

      return {
        id: d.id,
        title: d.title,
        period: d.period,
        dueDate: d.dueDate,
        status: d.status,
        member: d.member?.fullName,
        family: d.family?.name,
        area: d.family?.house?.division?.name || "—",
        house: d.family?.house?.displayNumber || "—",
        amount: d.amount.toFixed(2),
        paidAmount: d.paidAmount.toFixed(2),
        outstandingAmount: out.toFixed(2)
      };
    });

    return {
      totalExpected: totalExpected.toFixed(2),
      totalPaid: totalPaid.toFixed(2),
      totalOutstanding: totalOutstanding.toFixed(2),
      count: dues.length,
      rows
    };
  }
}
