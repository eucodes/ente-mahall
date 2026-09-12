import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { Prisma, type GraveRecord } from "@mahalle/database";
import { PrismaService } from "../../database/prisma.service";
import { AuditService } from "../../audit/audit.service";
import type { CreateGraveRecordDto } from "./dto/create-grave-record.dto";
import type { UpdateGraveRecordDto } from "./dto/update-grave-record.dto";

interface RequestContext {
  ipAddress?: string;
  userAgent?: string;
}
interface ActorContext {
  userId: string;
  tenantId: string;
}

function toData(dto: Partial<CreateGraveRecordDto>) {
  const { burialDate, ...rest } = dto;
  return { ...rest, ...(burialDate !== undefined && { burialDate: new Date(burialDate) }) };
}

@Injectable()
export class GraveService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService
  ) {}

  async list(tenantId: string, page: number, pageSize: number): Promise<{ records: GraveRecord[]; total: number }> {
    const where = { tenantId };
    const [records, total] = await Promise.all([
      this.prisma.graveRecord.findMany({ where, orderBy: { burialDate: "desc" }, skip: (page - 1) * pageSize, take: pageSize }),
      this.prisma.graveRecord.count({ where })
    ]);
    return { records, total };
  }

  async findOne(tenantId: string, id: string): Promise<GraveRecord> {
    const record = await this.prisma.graveRecord.findFirst({ where: { id, tenantId } });
    if (!record) throw new NotFoundException("Grave record not found");
    return record;
  }

  async create(actor: ActorContext, dto: CreateGraveRecordDto, context: RequestContext): Promise<GraveRecord> {
    let record: GraveRecord;
    try {
      record = await this.prisma.graveRecord.create({
        data: { ...toData(dto), tenantId: actor.tenantId } as Prisma.GraveRecordUncheckedCreateInput
      });
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
        throw new ConflictException("A grave record with this plot number already exists.");
      }
      throw err;
    }
    await this.audit.record({
      actorUserId: actor.userId,
      tenantId: actor.tenantId,
      action: "registers.grave.create",
      targetType: "GraveRecord",
      targetId: record.id,
      ipAddress: context.ipAddress,
      userAgent: context.userAgent
    });
    return record;
  }

  async update(actor: ActorContext, id: string, dto: UpdateGraveRecordDto, context: RequestContext): Promise<GraveRecord> {
    await this.findOne(actor.tenantId, id);
    let record: GraveRecord;
    try {
      record = await this.prisma.graveRecord.update({ where: { id }, data: toData(dto) });
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
        throw new ConflictException("A grave record with this plot number already exists.");
      }
      throw err;
    }
    await this.audit.record({
      actorUserId: actor.userId,
      tenantId: actor.tenantId,
      action: "registers.grave.update",
      targetType: "GraveRecord",
      targetId: record.id,
      ipAddress: context.ipAddress,
      userAgent: context.userAgent
    });
    return record;
  }

  async remove(actor: ActorContext, id: string, context: RequestContext): Promise<void> {
    await this.findOne(actor.tenantId, id);
    await this.prisma.graveRecord.delete({ where: { id } });
    await this.audit.record({
      actorUserId: actor.userId,
      tenantId: actor.tenantId,
      action: "registers.grave.delete",
      targetType: "GraveRecord",
      targetId: id,
      ipAddress: context.ipAddress,
      userAgent: context.userAgent
    });
  }
}
