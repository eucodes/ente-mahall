import { Injectable, NotFoundException } from "@nestjs/common";
import type { MarriageRecord, Prisma } from "@mahalle/database";
import { PrismaService } from "../../database/prisma.service";
import { AuditService } from "../../audit/audit.service";
import { CertificateService } from "../certificates/certificate.service";
import type { CreateMarriageRecordDto } from "./dto/create-marriage-record.dto";
import type { UpdateMarriageRecordDto } from "./dto/update-marriage-record.dto";

interface RequestContext {
  ipAddress?: string;
  userAgent?: string;
}
interface ActorContext {
  userId: string;
  tenantId: string;
}

function toData(dto: Partial<CreateMarriageRecordDto>) {
  const { marriageDate, ...rest } = dto;
  return { ...rest, ...(marriageDate !== undefined && { marriageDate: new Date(marriageDate) }) };
}

@Injectable()
export class MarriageService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
    private readonly certificates: CertificateService
  ) {}

  async list(tenantId: string, page: number, pageSize: number): Promise<{ records: MarriageRecord[]; total: number }> {
    const where = { tenantId };
    const [records, total] = await Promise.all([
      this.prisma.marriageRecord.findMany({ where, orderBy: { marriageDate: "desc" }, skip: (page - 1) * pageSize, take: pageSize }),
      this.prisma.marriageRecord.count({ where })
    ]);
    return { records, total };
  }

  async findOne(tenantId: string, id: string): Promise<MarriageRecord> {
    const record = await this.prisma.marriageRecord.findFirst({ where: { id, tenantId } });
    if (!record) throw new NotFoundException("Marriage record not found");
    return record;
  }

  async create(actor: ActorContext, dto: CreateMarriageRecordDto, context: RequestContext): Promise<MarriageRecord> {
    const record = await this.prisma.marriageRecord.create({
      data: { ...toData(dto), tenantId: actor.tenantId } as Prisma.MarriageRecordUncheckedCreateInput
    });
    await this.audit.record({
      actorUserId: actor.userId,
      tenantId: actor.tenantId,
      action: "registers.marriage.create",
      targetType: "MarriageRecord",
      targetId: record.id,
      ipAddress: context.ipAddress,
      userAgent: context.userAgent
    });
    return record;
  }

  async update(actor: ActorContext, id: string, dto: UpdateMarriageRecordDto, context: RequestContext): Promise<MarriageRecord> {
    await this.findOne(actor.tenantId, id);
    const record = await this.prisma.marriageRecord.update({ where: { id }, data: toData(dto) });
    await this.audit.record({
      actorUserId: actor.userId,
      tenantId: actor.tenantId,
      action: "registers.marriage.update",
      targetType: "MarriageRecord",
      targetId: record.id,
      ipAddress: context.ipAddress,
      userAgent: context.userAgent
    });
    return record;
  }

  async remove(actor: ActorContext, id: string, context: RequestContext): Promise<void> {
    await this.findOne(actor.tenantId, id);
    await this.prisma.marriageRecord.delete({ where: { id } });
    await this.audit.record({
      actorUserId: actor.userId,
      tenantId: actor.tenantId,
      action: "registers.marriage.delete",
      targetType: "MarriageRecord",
      targetId: id,
      ipAddress: context.ipAddress,
      userAgent: context.userAgent
    });
  }

  async issueCertificate(actor: ActorContext, id: string, context: RequestContext): Promise<MarriageRecord> {
    const existing = await this.findOne(actor.tenantId, id);
    if (existing.certificateNumber) return existing;
    const certificateNumber = await this.certificates.nextNumber(actor.tenantId, "MARRIAGE", "MAR");
    const record = await this.prisma.marriageRecord.update({
      where: { id },
      data: { certificateNumber, certificateIssuedAt: new Date() }
    });
    await this.audit.record({
      actorUserId: actor.userId,
      tenantId: actor.tenantId,
      action: "registers.marriage.certificate.issue",
      targetType: "MarriageRecord",
      targetId: id,
      metadata: { certificateNumber },
      ipAddress: context.ipAddress,
      userAgent: context.userAgent
    });
    return record;
  }
}
