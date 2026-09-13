import { BadRequestException, ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { Prisma } from "@mahalle/database";
import { PrismaService } from "../database/prisma.service";
import { AuditService } from "../audit/audit.service";
import type { UpdateFinanceSettingsDto } from "./dto/update-finance-settings.dto";
import type { CreatePaymentMethodDto, UpdatePaymentMethodDto } from "./dto/create-payment-method.dto";
import type { CreateBankAccountDto, UpdateBankAccountDto } from "./dto/create-bank-account.dto";
import type {
  CreateCollectionCategoryDto,
  UpdateCollectionCategoryDto,
  CreateExpenseCategoryDto,
  UpdateExpenseCategoryDto
} from "./dto/create-category.dto";

interface RequestContext {
  ipAddress?: string;
  userAgent?: string;
}

interface ActorContext {
  userId: string;
  tenantId: string;
}

@Injectable()
export class FinanceSettingsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService
  ) {}

  // --- General Settings -----------------------------------------------------

  async getSettings(tenantId: string) {
    let settings = await this.prisma.financeSettings.findUnique({
      where: { tenantId }
    });

    if (!settings) {
      settings = await this.prisma.financeSettings.create({
        data: {
          tenantId,
          currency: "INR",
          financialYearStartMonth: 4,
          financialYearStartDay: 1,
          receiptPrefix: "RCP",
          receiptStartNumber: 1,
          receiptDigits: 6,
          voucherPrefix: "VCH",
          voucherStartNumber: 1,
          voucherDigits: 6
        }
      });
    }

    return settings;
  }

  async updateSettings(actor: ActorContext, dto: UpdateFinanceSettingsDto, context: RequestContext) {
    const previous = await this.getSettings(actor.tenantId);

    const updated = await this.prisma.financeSettings.upsert({
      where: { tenantId: actor.tenantId },
      update: dto,
      create: { ...dto, tenantId: actor.tenantId }
    });

    await this.audit.record({
      actorUserId: actor.userId,
      tenantId: actor.tenantId,
      action: "finance.settings.update",
      targetType: "FinanceSettings",
      targetId: updated.id,
      metadata: { previous, updated: dto },
      ipAddress: context.ipAddress,
      userAgent: context.userAgent
    });

    return updated;
  }

  // --- Payment Methods -----------------------------------------------------

  async listPaymentMethods(tenantId: string) {
    return this.prisma.financePaymentMethod.findMany({
      where: { tenantId, isActive: true },
      orderBy: { displayOrder: "asc" }
    });
  }

  async createPaymentMethod(actor: ActorContext, dto: CreatePaymentMethodDto, context: RequestContext) {
    const existing = await this.prisma.financePaymentMethod.findFirst({
      where: { tenantId: actor.tenantId, code: dto.code }
    });
    if (existing) throw new ConflictException(`A payment method with code ${dto.code} already exists.`);

    const pm = await this.prisma.financePaymentMethod.create({
      data: { ...dto, tenantId: actor.tenantId }
    });

    await this.audit.record({
      actorUserId: actor.userId,
      tenantId: actor.tenantId,
      action: "finance.paymentMethod.create",
      targetType: "FinancePaymentMethod",
      targetId: pm.id,
      metadata: { name: pm.name, code: pm.code },
      ipAddress: context.ipAddress,
      userAgent: context.userAgent
    });

    return pm;
  }

  async updatePaymentMethod(actor: ActorContext, id: string, dto: UpdatePaymentMethodDto, context: RequestContext) {
    const existing = await this.prisma.financePaymentMethod.findFirst({ where: { id, tenantId: actor.tenantId } });
    if (!existing) throw new NotFoundException("Payment method not found");

    const updated = await this.prisma.financePaymentMethod.update({
      where: { id },
      data: dto
    });

    await this.audit.record({
      actorUserId: actor.userId,
      tenantId: actor.tenantId,
      action: "finance.paymentMethod.update",
      targetType: "FinancePaymentMethod",
      targetId: id,
      metadata: { previous: existing, updated: dto },
      ipAddress: context.ipAddress,
      userAgent: context.userAgent
    });

    return updated;
  }

  async removePaymentMethod(actor: ActorContext, id: string, context: RequestContext) {
    const existing = await this.prisma.financePaymentMethod.findFirst({ where: { id, tenantId: actor.tenantId } });
    if (!existing) throw new NotFoundException("Payment method not found");

    await this.prisma.financePaymentMethod.update({ where: { id }, data: { isActive: false } });

    await this.audit.record({
      actorUserId: actor.userId,
      tenantId: actor.tenantId,
      action: "finance.paymentMethod.deactivate",
      targetType: "FinancePaymentMethod",
      targetId: id,
      metadata: { name: existing.name },
      ipAddress: context.ipAddress,
      userAgent: context.userAgent
    });
  }

  // --- Bank Accounts -------------------------------------------------------

  async listBankAccounts(tenantId: string, maskNumber = true) {
    const accounts = await this.prisma.financeBankAccount.findMany({
      where: { tenantId, isActive: true },
      orderBy: { accountName: "asc" },
      include: { chartAccount: { select: { id: true, name: true, code: true } } }
    });

    if (maskNumber) {
      return accounts.map((acc) => ({
        ...acc,
        accountNumber: this.maskAccountNumber(acc.accountNumber)
      }));
    }

    return accounts;
  }

  async findBankAccountOrThrow(tenantId: string, id: string) {
    const acc = await this.prisma.financeBankAccount.findFirst({
      where: { id, tenantId, isActive: true },
      include: { chartAccount: true }
    });
    if (!acc) throw new NotFoundException("Bank account not found");
    return acc;
  }

  maskAccountNumber(accNo: string): string {
    if (!accNo || accNo.length <= 4) return accNo;
    const last4 = accNo.slice(-4);
    return `XXXX XXXX ${last4}`;
  }

  async createBankAccount(actor: ActorContext, dto: CreateBankAccountDto, context: RequestContext) {
    const openingBal = dto.openingBalance ? new Prisma.Decimal(dto.openingBalance) : new Prisma.Decimal(0);

    const bankAccount = await this.prisma.financeBankAccount.create({
      data: {
        tenantId: actor.tenantId,
        accountName: dto.accountName,
        bankName: dto.bankName,
        branch: dto.branch ?? null,
        accountNumber: dto.accountNumber,
        ifsc: dto.ifsc ?? null,
        accountType: dto.accountType ?? "SAVINGS",
        openingBalance: openingBal,
        currentBalance: openingBal,
        chartAccountId: dto.chartAccountId ?? null
      }
    });

    await this.audit.record({
      actorUserId: actor.userId,
      tenantId: actor.tenantId,
      action: "finance.bankAccount.create",
      targetType: "FinanceBankAccount",
      targetId: bankAccount.id,
      metadata: { accountName: bankAccount.accountName, bankName: bankAccount.bankName, masked: this.maskAccountNumber(bankAccount.accountNumber) },
      ipAddress: context.ipAddress,
      userAgent: context.userAgent
    });

    return { ...bankAccount, accountNumber: this.maskAccountNumber(bankAccount.accountNumber) };
  }

  async updateBankAccount(actor: ActorContext, id: string, dto: UpdateBankAccountDto, context: RequestContext) {
    await this.findBankAccountOrThrow(actor.tenantId, id);

    const updated = await this.prisma.financeBankAccount.update({
      where: { id },
      data: {
        accountName: dto.accountName,
        bankName: dto.bankName,
        branch: dto.branch,
        ...(dto.accountNumber ? { accountNumber: dto.accountNumber } : {}),
        ifsc: dto.ifsc,
        accountType: dto.accountType,
        chartAccountId: dto.chartAccountId,
        isActive: dto.isActive
      }
    });

    await this.audit.record({
      actorUserId: actor.userId,
      tenantId: actor.tenantId,
      action: "finance.bankAccount.update",
      targetType: "FinanceBankAccount",
      targetId: id,
      metadata: { accountName: updated.accountName },
      ipAddress: context.ipAddress,
      userAgent: context.userAgent
    });

    return { ...updated, accountNumber: this.maskAccountNumber(updated.accountNumber) };
  }

  async removeBankAccount(actor: ActorContext, id: string, context: RequestContext) {
    const acc = await this.findBankAccountOrThrow(actor.tenantId, id);
    await this.prisma.financeBankAccount.update({ where: { id }, data: { isActive: false } });

    await this.audit.record({
      actorUserId: actor.userId,
      tenantId: actor.tenantId,
      action: "finance.bankAccount.deactivate",
      targetType: "FinanceBankAccount",
      targetId: id,
      metadata: { accountName: acc.accountName },
      ipAddress: context.ipAddress,
      userAgent: context.userAgent
    });
  }

  // --- Collection Categories ------------------------------------------------

  async listCollectionCategories(tenantId: string) {
    return this.prisma.collectionCategory.findMany({
      where: { tenantId, isActive: true },
      orderBy: { displayOrder: "asc" },
      include: { incomeAccount: { select: { id: true, name: true, code: true } } }
    });
  }

  async createCollectionCategory(actor: ActorContext, dto: CreateCollectionCategoryDto, context: RequestContext) {
    const existing = await this.prisma.collectionCategory.findFirst({
      where: { tenantId: actor.tenantId, name: dto.name }
    });
    if (existing) throw new ConflictException(`A collection category with name "${dto.name}" already exists.`);

    const { defaultAmount, ...rest } = dto;
    const cat = await this.prisma.collectionCategory.create({
      data: {
        ...rest,
        defaultAmount: defaultAmount !== undefined && defaultAmount !== null && defaultAmount !== "" ? new Prisma.Decimal(defaultAmount) : null,
        tenantId: actor.tenantId
      }
    });

    await this.audit.record({
      actorUserId: actor.userId,
      tenantId: actor.tenantId,
      action: "finance.collectionCategory.create",
      targetType: "CollectionCategory",
      targetId: cat.id,
      metadata: { name: cat.name },
      ipAddress: context.ipAddress,
      userAgent: context.userAgent
    });

    return cat;
  }

  async updateCollectionCategory(actor: ActorContext, id: string, dto: UpdateCollectionCategoryDto, context: RequestContext) {
    const cat = await this.prisma.collectionCategory.findFirst({ where: { id, tenantId: actor.tenantId } });
    if (!cat) throw new NotFoundException("Collection category not found");

    const { defaultAmount, ...rest } = dto;
    const updated = await this.prisma.collectionCategory.update({
      where: { id },
      data: {
        ...rest,
        ...(defaultAmount !== undefined ? {
          defaultAmount: defaultAmount !== null && defaultAmount !== "" ? new Prisma.Decimal(defaultAmount) : null
        } : {})
      }
    });

    await this.audit.record({
      actorUserId: actor.userId,
      tenantId: actor.tenantId,
      action: "finance.collectionCategory.update",
      targetType: "CollectionCategory",
      targetId: id,
      metadata: { previous: cat, updated: dto },
      ipAddress: context.ipAddress,
      userAgent: context.userAgent
    });

    return updated;
  }

  async removeCollectionCategory(actor: ActorContext, id: string, context: RequestContext) {
    const cat = await this.prisma.collectionCategory.findFirst({
      where: { id, tenantId: actor.tenantId },
      include: { _count: { select: { collections: true, dues: true } } }
    });
    if (!cat) throw new NotFoundException("Collection category not found");

    if (cat._count.collections > 0 || cat._count.dues > 0) {
      await this.prisma.collectionCategory.update({ where: { id }, data: { isActive: false } });
    } else {
      await this.prisma.collectionCategory.delete({ where: { id } });
    }

    await this.audit.record({
      actorUserId: actor.userId,
      tenantId: actor.tenantId,
      action: "finance.collectionCategory.remove",
      targetType: "CollectionCategory",
      targetId: id,
      metadata: { name: cat.name },
      ipAddress: context.ipAddress,
      userAgent: context.userAgent
    });
  }

  // --- Expense Categories ---------------------------------------------------

  async listExpenseCategories(tenantId: string) {
    return this.prisma.expenseCategory.findMany({
      where: { tenantId, isActive: true },
      orderBy: { displayOrder: "asc" },
      include: { expenseAccount: { select: { id: true, name: true, code: true } } }
    });
  }

  async createExpenseCategory(actor: ActorContext, dto: CreateExpenseCategoryDto, context: RequestContext) {
    const existing = await this.prisma.expenseCategory.findFirst({
      where: { tenantId: actor.tenantId, name: dto.name }
    });
    if (existing) throw new ConflictException(`An expense category with name "${dto.name}" already exists.`);

    const cat = await this.prisma.expenseCategory.create({
      data: { ...dto, tenantId: actor.tenantId }
    });

    await this.audit.record({
      actorUserId: actor.userId,
      tenantId: actor.tenantId,
      action: "finance.expenseCategory.create",
      targetType: "ExpenseCategory",
      targetId: cat.id,
      metadata: { name: cat.name },
      ipAddress: context.ipAddress,
      userAgent: context.userAgent
    });

    return cat;
  }

  async updateExpenseCategory(actor: ActorContext, id: string, dto: UpdateExpenseCategoryDto, context: RequestContext) {
    const cat = await this.prisma.expenseCategory.findFirst({ where: { id, tenantId: actor.tenantId } });
    if (!cat) throw new NotFoundException("Expense category not found");

    const updated = await this.prisma.expenseCategory.update({
      where: { id },
      data: dto
    });

    await this.audit.record({
      actorUserId: actor.userId,
      tenantId: actor.tenantId,
      action: "finance.expenseCategory.update",
      targetType: "ExpenseCategory",
      targetId: id,
      metadata: { previous: cat, updated: dto },
      ipAddress: context.ipAddress,
      userAgent: context.userAgent
    });

    return updated;
  }

  async removeExpenseCategory(actor: ActorContext, id: string, context: RequestContext) {
    const cat = await this.prisma.expenseCategory.findFirst({ where: { id, tenantId: actor.tenantId } });
    if (!cat) throw new NotFoundException("Expense category not found");

    await this.prisma.expenseCategory.update({ where: { id }, data: { isActive: false } });

    await this.audit.record({
      actorUserId: actor.userId,
      tenantId: actor.tenantId,
      action: "finance.expenseCategory.deactivate",
      targetType: "ExpenseCategory",
      targetId: id,
      metadata: { name: cat.name },
      ipAddress: context.ipAddress,
      userAgent: context.userAgent
    });
  }
}
