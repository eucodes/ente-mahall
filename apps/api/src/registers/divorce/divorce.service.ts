import { Injectable, NotFoundException } from "@nestjs/common";
import type { DivorceRecord, Prisma } from "@mahalle/database";
import { PrismaService } from "../../database/prisma.service";
import { AuditService } from "../../audit/audit.service";
import { CertificateService } from "../certificates/certificate.service";
import type { CreateDivorceRecordDto } from "./dto/create-divorce-record.dto";
import type { UpdateDivorceRecordDto } from "./dto/update-divorce-record.dto";

interface RequestContext {
  ipAddress?: string;
  userAgent?: string;
}
interface ActorContext {
  userId: string;
  tenantId: string;
}

function toData(dto: Partial<CreateDivorceRecordDto>) {
  const { divorceDate, ...rest } = dto;
  return { ...rest, ...(divorceDate !== undefined && { divorceDate: new Date(divorceDate) }) };
}

@Injectable()
export class DivorceService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
    private readonly certificates: CertificateService
  ) {}

  async list(tenantId: string, page: number, pageSize: number): Promise<{ records: DivorceRecord[]; total: number }> {
    const where = { tenantId };
    const [records, total] = await Promise.all([
      this.prisma.divorceRecord.findMany({ where, orderBy: { divorceDate: "desc" }, skip: (page - 1) * pageSize, take: pageSize }),
      this.prisma.divorceRecord.count({ where })
    ]);
    return { records, total };
  }

  async findOne(tenantId: string, id: string): Promise<DivorceRecord> {
    const record = await this.prisma.divorceRecord.findFirst({ where: { id, tenantId } });
    if (!record) throw new NotFoundException("Divorce record not found");
    return record;
  }

  async create(actor: ActorContext, dto: CreateDivorceRecordDto, context: RequestContext): Promise<DivorceRecord> {
    const record = await this.prisma.divorceRecord.create({
      data: { ...toData(dto), tenantId: actor.tenantId } as Prisma.DivorceRecordUncheckedCreateInput
    });
    await this.audit.record({
      actorUserId: actor.userId,
      tenantId: actor.tenantId,
      action: "registers.divorce.create",
      targetType: "DivorceRecord",
      targetId: record.id,
      ipAddress: context.ipAddress,
      userAgent: context.userAgent
    });
    return record;
  }

  async update(actor: ActorContext, id: string, dto: UpdateDivorceRecordDto, context: RequestContext): Promise<DivorceRecord> {
    await this.findOne(actor.tenantId, id);
    const record = await this.prisma.divorceRecord.update({ where: { id }, data: toData(dto) });
    await this.audit.record({
      actorUserId: actor.userId,
      tenantId: actor.tenantId,
      action: "registers.divorce.update",
      targetType: "DivorceRecord",
      targetId: record.id,
      ipAddress: context.ipAddress,
      userAgent: context.userAgent
    });
    return record;
  }

  async remove(actor: ActorContext, id: string, context: RequestContext): Promise<void> {
    await this.findOne(actor.tenantId, id);
    await this.prisma.divorceRecord.delete({ where: { id } });
    await this.audit.record({
      actorUserId: actor.userId,
      tenantId: actor.tenantId,
      action: "registers.divorce.delete",
      targetType: "DivorceRecord",
      targetId: id,
      ipAddress: context.ipAddress,
      userAgent: context.userAgent
    });
  }

  async issueCertificate(actor: ActorContext, id: string, context: RequestContext): Promise<DivorceRecord> {
    const existing = await this.findOne(actor.tenantId, id);
    if (existing.certificateNumber) return existing;
    const certificateNumber = await this.certificates.nextNumber(actor.tenantId, "DIVORCE", "DIV");
    const record = await this.prisma.divorceRecord.update({
      where: { id },
      data: { certificateNumber, certificateIssuedAt: new Date() }
    });
    await this.audit.record({
      actorUserId: actor.userId,
      tenantId: actor.tenantId,
      action: "registers.divorce.certificate.issue",
      targetType: "DivorceRecord",
      targetId: id,
      metadata: { certificateNumber },
      ipAddress: context.ipAddress,
      userAgent: context.userAgent
    });
    return record;
  }
}
