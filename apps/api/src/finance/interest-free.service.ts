import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { Prisma } from "@mahalle/database";
import { PrismaService } from "../database/prisma.service";
import { AuditService } from "../audit/audit.service";
import { CertificateService } from "../registers/certificates/certificate.service";
import type { CreateInterestFreeAccountDto, CreateInterestFreeTransactionDto } from "./dto/create-interest-free.dto";

interface RequestContext {
  ipAddress?: string;
  userAgent?: string;
}

interface ActorContext {
  userId: string;
  tenantId: string;
}

@Injectable()
export class InterestFreeBankingService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
    private readonly certificates: CertificateService
  ) {}

  async listAccounts(tenantId: string, page = 1, pageSize = 20, search?: string) {
    const where: Prisma.InterestFreeAccountWhereInput = {
      tenantId,
      ...(search
        ? {
            OR: [
              { accountNumber: { contains: search, mode: "insensitive" } },
              { holderName: { contains: search, mode: "insensitive" } },
              { phone: { contains: search, mode: "insensitive" } }
            ]
          }
        : {})
    };

    const [accounts, total] = await Promise.all([
      this.prisma.interestFreeAccount.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
        include: {
          member: { select: { id: true, fullName: true, phone: true } },
          family: { select: { id: true, name: true, familyNumber: true } }
        }
      }),
      this.prisma.interestFreeAccount.count({ where })
    ]);

    return { accounts, total };
  }

  async getAccount(tenantId: string, id: string) {
    const account = await this.prisma.interestFreeAccount.findFirst({
      where: { id, tenantId },
      include: {
        member: true,
        family: true,
        transactions: { orderBy: { date: "desc" } }
      }
    });
    if (!account) throw new NotFoundException("Interest-free banking account not found");
    return account;
  }

  async createAccount(actor: ActorContext, dto: CreateInterestFreeAccountDto, context: RequestContext) {
    let accountNumber = dto.accountNumber;
    if (!accountNumber) {
      accountNumber = await this.certificates.nextNumber(actor.tenantId, "INTEREST_FREE_ACC", "IFB");
    }

    const openingBalance = dto.openingBalance ? new Prisma.Decimal(dto.openingBalance) : new Prisma.Decimal(0);

    const account = await this.prisma.interestFreeAccount.create({
      data: {
        tenantId: actor.tenantId,
        accountNumber,
        holderName: dto.holderName,
        holderType: dto.holderType ?? "MEMBER",
        memberId: dto.memberId ?? null,
        familyId: dto.familyId ?? null,
        phone: dto.phone ?? null,
        balance: openingBalance,
        status: "ACTIVE"
      }
    });

    await this.audit.record({
      actorUserId: actor.userId,
      tenantId: actor.tenantId,
      action: "banking.interestFree.createAccount",
      targetType: "InterestFreeAccount",
      targetId: account.id,
      metadata: { accountNumber, holderName: dto.holderName },
      ipAddress: context.ipAddress,
      userAgent: context.userAgent
    });

    return account;
  }

  async recordTransaction(actor: ActorContext, dto: CreateInterestFreeTransactionDto, context: RequestContext) {
    const account = await this.prisma.interestFreeAccount.findFirst({
      where: { id: dto.accountId, tenantId: actor.tenantId }
    });
    if (!account) throw new NotFoundException("Account not found");
    if (account.status !== "ACTIVE") throw new BadRequestException("Account is not active.");

    const amount = new Prisma.Decimal(dto.amount);
    if (amount.lessThanOrEqualTo(0)) throw new BadRequestException("Transaction amount must be greater than zero.");

    let newBalance = account.balance;
    if (dto.type === "DEPOSIT") {
      newBalance = newBalance.plus(amount);
    } else if (dto.type === "WITHDRAWAL") {
      if (newBalance.lessThan(amount)) {
        throw new BadRequestException(`Insufficient funds. Current balance: ₹${newBalance.toFixed(2)}`);
      }
      newBalance = newBalance.minus(amount);
    }

    const receiptNumber = await this.certificates.nextNumber(actor.tenantId, "IFB_TX", "IFB-TX");

    const result = await this.prisma.$transaction(async (tx) => {
      const transaction = await tx.interestFreeTransaction.create({
        data: {
          tenantId: actor.tenantId,
          accountId: account.id,
          type: dto.type,
          amount,
          date: dto.date ? new Date(dto.date) : new Date(),
          reference: dto.reference ?? null,
          description: dto.description ?? `${dto.type} transaction`,
          balanceAfter: newBalance,
          receiptNumber
        }
      });

      await tx.interestFreeAccount.update({
        where: { id: account.id },
        data: { balance: newBalance }
      });

      return transaction;
    });

    await this.audit.record({
      actorUserId: actor.userId,
      tenantId: actor.tenantId,
      action: "banking.interestFree.transaction",
      targetType: "InterestFreeTransaction",
      targetId: result.id,
      metadata: { accountNumber: account.accountNumber, type: dto.type, amount: amount.toFixed(2) },
      ipAddress: context.ipAddress,
      userAgent: context.userAgent
    });

    return result;
  }
}
