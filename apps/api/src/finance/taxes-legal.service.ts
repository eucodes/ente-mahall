import { Injectable, NotFoundException } from "@nestjs/common";
import { Prisma, type TaxLegalFiling } from "@mahalle/database";
import { PrismaService } from "../database/prisma.service";
import { AuditService } from "../audit/audit.service";
import type { CreateTaxLegalFilingDto, UpdateTaxLegalFilingDto } from "./dto/create-tax-legal.dto";

interface RequestContext {
  ipAddress?: string;
  userAgent?: string;
}

interface ActorContext {
  userId: string;
  tenantId: string;
}

@Injectable()
export class TaxesLegalService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService
  ) {}

  async listFilings(tenantId: string, status?: string) {
    const where: Prisma.TaxLegalFilingWhereInput = {
      tenantId,
      ...(status ? { status } : {})
    };

    return this.prisma.taxLegalFiling.findMany({
      where,
      orderBy: { dueDate: "asc" }
    });
  }

  async findFilingOrThrow(tenantId: string, id: string): Promise<TaxLegalFiling> {
    const filing = await this.prisma.taxLegalFiling.findFirst({
      where: { id, tenantId }
    });
    if (!filing) throw new NotFoundException("Tax/Legal filing not found");
    return filing;
  }

  async createFiling(actor: ActorContext, dto: CreateTaxLegalFilingDto, context: RequestContext) {
    const filing = await this.prisma.taxLegalFiling.create({
      data: {
        tenantId: actor.tenantId,
        title: dto.title,
        filingType: dto.filingType,
        period: dto.period ?? null,
        dueDate: new Date(dto.dueDate),
        amount: dto.amount ? new Prisma.Decimal(dto.amount) : null,
        status: dto.status ?? "PENDING",
        paymentDate: dto.paymentDate ? new Date(dto.paymentDate) : null,
        reference: dto.reference ?? null,
        notes: dto.notes ?? null,
        documentUrl: dto.documentUrl ?? null
      }
    });

    await this.audit.record({
      actorUserId: actor.userId,
      tenantId: actor.tenantId,
      action: "taxes.filing.create",
      targetType: "TaxLegalFiling",
      targetId: filing.id,
      metadata: { title: filing.title, filingType: filing.filingType },
      ipAddress: context.ipAddress,
      userAgent: context.userAgent
    });

    return filing;
  }

  async updateFiling(actor: ActorContext, id: string, dto: UpdateTaxLegalFilingDto, context: RequestContext) {
    await this.findFilingOrThrow(actor.tenantId, id);

    const updated = await this.prisma.taxLegalFiling.update({
      where: { id },
      data: {
        ...dto,
        ...(dto.dueDate ? { dueDate: new Date(dto.dueDate) } : {}),
        ...(dto.paymentDate !== undefined ? { paymentDate: dto.paymentDate ? new Date(dto.paymentDate) : null } : {}),
        ...(dto.amount !== undefined ? { amount: dto.amount ? new Prisma.Decimal(dto.amount) : null } : {})
      }
    });

    await this.audit.record({
      actorUserId: actor.userId,
      tenantId: actor.tenantId,
      action: "taxes.filing.update",
      targetType: "TaxLegalFiling",
      targetId: id,
      metadata: { updated: dto },
      ipAddress: context.ipAddress,
      userAgent: context.userAgent
    });

    return updated;
  }

  async removeFiling(actor: ActorContext, id: string, context: RequestContext) {
    const filing = await this.findFilingOrThrow(actor.tenantId, id);
    await this.prisma.taxLegalFiling.delete({ where: { id } });

    await this.audit.record({
      actorUserId: actor.userId,
      tenantId: actor.tenantId,
      action: "taxes.filing.delete",
      targetType: "TaxLegalFiling",
      targetId: id,
      metadata: { title: filing.title },
      ipAddress: context.ipAddress,
      userAgent: context.userAgent
    });
  }
}
