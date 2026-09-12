import { Injectable, NotFoundException } from "@nestjs/common";
import type { Prisma, PropertyRecord } from "@mahalle/database";
import { PrismaService } from "../../database/prisma.service";
import { AuditService } from "../../audit/audit.service";
import type { CreatePropertyRecordDto } from "./dto/create-property-record.dto";
import type { UpdatePropertyRecordDto } from "./dto/update-property-record.dto";

interface RequestContext {
  ipAddress?: string;
  userAgent?: string;
}
interface ActorContext {
  userId: string;
  tenantId: string;
}

function toData(dto: Partial<CreatePropertyRecordDto>) {
  const { acquisitionDate, ...rest } = dto;
  return { ...rest, ...(acquisitionDate !== undefined && { acquisitionDate: acquisitionDate ? new Date(acquisitionDate) : null }) };
}

@Injectable()
export class PropertyService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService
  ) {}

  async list(tenantId: string, page: number, pageSize: number): Promise<{ records: PropertyRecord[]; total: number }> {
    const where = { tenantId, isActive: true };
    const [records, total] = await Promise.all([
      this.prisma.propertyRecord.findMany({ where, orderBy: { name: "asc" }, skip: (page - 1) * pageSize, take: pageSize }),
      this.prisma.propertyRecord.count({ where })
    ]);
    return { records, total };
  }

  async findOne(tenantId: string, id: string): Promise<PropertyRecord> {
    const record = await this.prisma.propertyRecord.findFirst({ where: { id, tenantId, isActive: true } });
    if (!record) throw new NotFoundException("Property record not found");
    return record;
  }

  async create(actor: ActorContext, dto: CreatePropertyRecordDto, context: RequestContext): Promise<PropertyRecord> {
    const record = await this.prisma.propertyRecord.create({
      data: { ...toData(dto), tenantId: actor.tenantId } as Prisma.PropertyRecordUncheckedCreateInput
    });
    await this.audit.record({
      actorUserId: actor.userId,
      tenantId: actor.tenantId,
      action: "registers.property.create",
      targetType: "PropertyRecord",
      targetId: record.id,
      ipAddress: context.ipAddress,
      userAgent: context.userAgent
    });
    return record;
  }

  async update(actor: ActorContext, id: string, dto: UpdatePropertyRecordDto, context: RequestContext): Promise<PropertyRecord> {
    await this.findOne(actor.tenantId, id);
    const record = await this.prisma.propertyRecord.update({ where: { id }, data: toData(dto) });
    await this.audit.record({
      actorUserId: actor.userId,
      tenantId: actor.tenantId,
      action: "registers.property.update",
      targetType: "PropertyRecord",
      targetId: record.id,
      ipAddress: context.ipAddress,
      userAgent: context.userAgent
    });
    return record;
  }

  async remove(actor: ActorContext, id: string, context: RequestContext): Promise<void> {
    await this.findOne(actor.tenantId, id);
    await this.prisma.propertyRecord.update({ where: { id }, data: { isActive: false } });
    await this.audit.record({
      actorUserId: actor.userId,
      tenantId: actor.tenantId,
      action: "registers.property.delete",
      targetType: "PropertyRecord",
      targetId: id,
      ipAddress: context.ipAddress,
      userAgent: context.userAgent
    });
  }
}
