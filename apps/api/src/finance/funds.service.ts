import { BadRequestException, ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { Prisma } from "@mahalle/database";
import { PrismaService } from "../database/prisma.service";
import { AuditService } from "../audit/audit.service";
import type { CreateFinanceFundDto, UpdateFinanceFundDto } from "./dto/create-fund.dto";

interface RequestContext {
  ipAddress?: string;
  userAgent?: string;
}

interface ActorContext {
  userId: string;
  tenantId: string;
}

@Injectable()
export class FundsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService
  ) {}

  /**
   * Ensures default operational funds exist for the tenant if none exist.
   * Creates "Masjid Fund" and "Madrasa Fund" as specified in architecture.
   */
  async ensureDefaultFunds(tenantId: string) {
    const count = await this.prisma.financeFund.count({ where: { tenantId } });
    if (count === 0) {
      await this.prisma.financeFund.createMany({
        data: [
          {
            tenantId,
            name: "Masjid Fund",
            code: "MASJID",
            description: "Primary fund for Masjid operations, Friday collections, maintenance, and utility bills.",
            color: "#059669",
            isDefault: true,
            displayOrder: 1
          },
          {
            tenantId,
            name: "Madrasa Fund",
            code: "MADRASA",
            description: "Dedicated fund for Madrasa education, student fees, teacher salaries, and academic supplies.",
            color: "#2563eb",
            isDefault: false,
            displayOrder: 2
          }
        ]
      });
    }
  }

  async listFunds(tenantId: string) {
    await this.ensureDefaultFunds(tenantId);
    return this.prisma.financeFund.findMany({
      where: { tenantId, isActive: true },
      orderBy: [{ displayOrder: "asc" }, { name: "asc" }],
      include: {
        _count: {
          select: {
            collectionCategories: true,
            expenseCategories: true,
            collections: true,
            vouchers: true
          }
        }
      }
    });
  }

  async getFund(tenantId: string, id: string) {
    const fund = await this.prisma.financeFund.findFirst({
      where: { id, tenantId, isActive: true },
      include: {
        collectionCategories: {
          where: { isActive: true },
          include: { incomeAccount: { select: { id: true, name: true, code: true } } }
        },
        expenseCategories: {
          where: { isActive: true },
          include: { expenseAccount: { select: { id: true, name: true, code: true } } }
        }
      }
    });
    if (!fund) throw new NotFoundException("Finance operational fund not found");
    return fund;
  }

  async createFund(actor: ActorContext, dto: CreateFinanceFundDto, context: RequestContext) {
    const existing = await this.prisma.financeFund.findFirst({
      where: { tenantId: actor.tenantId, name: { equals: dto.name, mode: "insensitive" } }
    });
    if (existing) {
      throw new ConflictException(`An operational fund named "${dto.name}" already exists.`);
    }

    if (dto.isDefault) {
      // Unset previous defaults
      await this.prisma.financeFund.updateMany({
        where: { tenantId: actor.tenantId, isDefault: true },
        data: { isDefault: false }
      });
    }

    const fund = await this.prisma.financeFund.create({
      data: {
        tenantId: actor.tenantId,
        name: dto.name,
        code: dto.code || null,
        description: dto.description || null,
        color: dto.color || "#059669",
        isDefault: dto.isDefault ?? false,
        isActive: dto.isActive ?? true,
        displayOrder: dto.displayOrder ?? 0
      }
    });

    await this.audit.record({
      actorUserId: actor.userId,
      tenantId: actor.tenantId,
      action: "finance.fund.create",
      targetType: "FinanceFund",
      targetId: fund.id,
      metadata: { name: fund.name, code: fund.code },
      ipAddress: context.ipAddress,
      userAgent: context.userAgent
    });

    return fund;
  }

  async updateFund(actor: ActorContext, id: string, dto: UpdateFinanceFundDto, context: RequestContext) {
    const fund = await this.prisma.financeFund.findFirst({
      where: { id, tenantId: actor.tenantId }
    });
    if (!fund) throw new NotFoundException("Operational fund not found");

    if (dto.name && dto.name !== fund.name) {
      const duplicate = await this.prisma.financeFund.findFirst({
        where: { tenantId: actor.tenantId, name: { equals: dto.name, mode: "insensitive" }, id: { not: id } }
      });
      if (duplicate) {
        throw new ConflictException(`Another fund named "${dto.name}" already exists.`);
      }
    }

    if (dto.isDefault) {
      await this.prisma.financeFund.updateMany({
        where: { tenantId: actor.tenantId, isDefault: true, id: { not: id } },
        data: { isDefault: false }
      });
    }

    const updated = await this.prisma.financeFund.update({
      where: { id },
      data: {
        ...(dto.name ? { name: dto.name } : {}),
        ...(dto.code !== undefined ? { code: dto.code } : {}),
        ...(dto.description !== undefined ? { description: dto.description } : {}),
        ...(dto.color !== undefined ? { color: dto.color } : {}),
        ...(dto.isDefault !== undefined ? { isDefault: dto.isDefault } : {}),
        ...(dto.isActive !== undefined ? { isActive: dto.isActive } : {}),
        ...(dto.displayOrder !== undefined ? { displayOrder: dto.displayOrder } : {})
      }
    });

    await this.audit.record({
      actorUserId: actor.userId,
      tenantId: actor.tenantId,
      action: "finance.fund.update",
      targetType: "FinanceFund",
      targetId: id,
      metadata: { previous: fund, updated: dto },
      ipAddress: context.ipAddress,
      userAgent: context.userAgent
    });

    return updated;
  }

  async removeFund(actor: ActorContext, id: string, context: RequestContext) {
    const fund = await this.prisma.financeFund.findFirst({
      where: { id, tenantId: actor.tenantId },
      include: {
        _count: {
          select: {
            collectionCategories: true,
            expenseCategories: true,
            collections: true,
            vouchers: true
          }
        }
      }
    });
    if (!fund) throw new NotFoundException("Operational fund not found");

    const totalUsage =
      fund._count.collectionCategories +
      fund._count.expenseCategories +
      fund._count.collections +
      fund._count.vouchers;

    if (totalUsage > 0) {
      // Soft-deactivate if in use
      await this.prisma.financeFund.update({
        where: { id },
        data: { isActive: false }
      });
    } else {
      await this.prisma.financeFund.delete({ where: { id } });
    }

    await this.audit.record({
      actorUserId: actor.userId,
      tenantId: actor.tenantId,
      action: "finance.fund.delete",
      targetType: "FinanceFund",
      targetId: id,
      metadata: { name: fund.name },
      ipAddress: context.ipAddress,
      userAgent: context.userAgent
    });

    return { success: true };
  }

  async getFundOverview(tenantId: string, fundId: string) {
    const fund = await this.getFund(tenantId, fundId);

    const [collectionsAgg, vouchersAgg] = await Promise.all([
      this.prisma.financeCollection.aggregate({
        where: { tenantId, fundId, status: "COMPLETED" },
        _sum: { amount: true },
        _count: { id: true }
      }),
      this.prisma.voucher.aggregate({
        where: { tenantId, fundId, status: "PAID", type: "PAYMENT" },
        _sum: { amount: true },
        _count: { id: true }
      })
    ]);

    const totalInflow = collectionsAgg._sum.amount || new Prisma.Decimal(0);
    const totalOutflow = vouchersAgg._sum.amount || new Prisma.Decimal(0);
    const netBalance = totalInflow.minus(totalOutflow);

    return {
      fund,
      totalInflow: totalInflow.toFixed(2),
      totalOutflow: totalOutflow.toFixed(2),
      netBalance: netBalance.toFixed(2),
      collectionsCount: collectionsAgg._count.id,
      paymentsCount: vouchersAgg._count.id
    };
  }
}
