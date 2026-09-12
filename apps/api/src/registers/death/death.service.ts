import { Injectable, NotFoundException } from "@nestjs/common";
import type { DeathRecord, Prisma } from "@mahalle/database";
import { PrismaService } from "../../database/prisma.service";
import { AuditService } from "../../audit/audit.service";
import { CertificateService } from "../certificates/certificate.service";
import type { CreateDeathRecordDto } from "./dto/create-death-record.dto";
import type { UpdateDeathRecordDto } from "./dto/update-death-record.dto";

interface RequestContext {
  ipAddress?: string;
  userAgent?: string;
}
interface ActorContext {
  userId: string;
  tenantId: string;
}

function toData(dto: Partial<CreateDeathRecordDto>) {
  const { dateOfDeath, dateOfBirth, burialDate, ...rest } = dto;
  return {
    ...rest,
    ...(dateOfDeath !== undefined && { dateOfDeath: new Date(dateOfDeath) }),
    ...(dateOfBirth !== undefined && { dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null }),
    ...(burialDate !== undefined && { burialDate: burialDate ? new Date(burialDate) : null })
  };
}

@Injectable()
export class DeathService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
    private readonly certificates: CertificateService
  ) {}

  async list(tenantId: string, page: number, pageSize: number): Promise<{ records: DeathRecord[]; total: number }> {
    const where = { tenantId };
    const [records, total] = await Promise.all([
      this.prisma.deathRecord.findMany({ where, orderBy: { dateOfDeath: "desc" }, skip: (page - 1) * pageSize, take: pageSize }),
      this.prisma.deathRecord.count({ where })
    ]);
    return { records, total };
  }

  async findOne(tenantId: string, id: string): Promise<DeathRecord> {
    const record = await this.prisma.deathRecord.findFirst({ where: { id, tenantId } });
    if (!record) throw new NotFoundException("Death record not found");
    return record;
  }

  async create(actor: ActorContext, dto: CreateDeathRecordDto, context: RequestContext): Promise<DeathRecord> {
    const record = await this.prisma.deathRecord.create({
      data: { ...toData(dto), tenantId: actor.tenantId } as Prisma.DeathRecordUncheckedCreateInput
    });
    await this.audit.record({
      actorUserId: actor.userId,
      tenantId: actor.tenantId,
      action: "registers.death.create",
      targetType: "DeathRecord",
      targetId: record.id,
      ipAddress: context.ipAddress,
      userAgent: context.userAgent
    });
    return record;
  }

  async update(actor: ActorContext, id: string, dto: UpdateDeathRecordDto, context: RequestContext): Promise<DeathRecord> {
    await this.findOne(actor.tenantId, id);
    const record = await this.prisma.deathRecord.update({ where: { id }, data: toData(dto) });
    await this.audit.record({
      actorUserId: actor.userId,
      tenantId: actor.tenantId,
      action: "registers.death.update",
      targetType: "DeathRecord",
      targetId: record.id,
      ipAddress: context.ipAddress,
      userAgent: context.userAgent
    });
    return record;
  }

  async remove(actor: ActorContext, id: string, context: RequestContext): Promise<void> {
    await this.findOne(actor.tenantId, id);
    await this.prisma.deathRecord.delete({ where: { id } });
    await this.audit.record({
      actorUserId: actor.userId,
      tenantId: actor.tenantId,
      action: "registers.death.delete",
      targetType: "DeathRecord",
      targetId: id,
      ipAddress: context.ipAddress,
      userAgent: context.userAgent
    });
  }

  async issueCertificate(actor: ActorContext, id: string, context: RequestContext): Promise<DeathRecord> {
    const existing = await this.findOne(actor.tenantId, id);
    if (existing.certificateNumber) return existing;
    const certificateNumber = await this.certificates.nextNumber(actor.tenantId, "DEATH", "DTH");
    const record = await this.prisma.deathRecord.update({
      where: { id },
      data: { certificateNumber, certificateIssuedAt: new Date() }
    });
    await this.audit.record({
      actorUserId: actor.userId,
      tenantId: actor.tenantId,
      action: "registers.death.certificate.issue",
      targetType: "DeathRecord",
      targetId: id,
      metadata: { certificateNumber },
      ipAddress: context.ipAddress,
      userAgent: context.userAgent
    });
    return record;
  }
}
