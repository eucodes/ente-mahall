import { Injectable, NotFoundException } from "@nestjs/common";
import type { MahalluReleaseRecord, Prisma } from "@mahalle/database";
import { PrismaService } from "../../database/prisma.service";
import { AuditService } from "../../audit/audit.service";
import { CertificateService } from "../certificates/certificate.service";
import type { CreateReleaseRecordDto } from "./dto/create-release-record.dto";
import type { UpdateReleaseRecordDto } from "./dto/update-release-record.dto";

interface RequestContext {
  ipAddress?: string;
  userAgent?: string;
}
interface ActorContext {
  userId: string;
  tenantId: string;
}

function toData(dto: Partial<CreateReleaseRecordDto>) {
  const { releaseDate, ...rest } = dto;
  return { ...rest, ...(releaseDate !== undefined && { releaseDate: new Date(releaseDate) }) };
}

@Injectable()
export class ReleaseService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
    private readonly certificates: CertificateService
  ) {}

  async list(tenantId: string, page: number, pageSize: number): Promise<{ records: MahalluReleaseRecord[]; total: number }> {
    const where = { tenantId };
    const [records, total] = await Promise.all([
      this.prisma.mahalluReleaseRecord.findMany({ where, orderBy: { releaseDate: "desc" }, skip: (page - 1) * pageSize, take: pageSize }),
      this.prisma.mahalluReleaseRecord.count({ where })
    ]);
    return { records, total };
  }

  async findOne(tenantId: string, id: string): Promise<MahalluReleaseRecord> {
    const record = await this.prisma.mahalluReleaseRecord.findFirst({ where: { id, tenantId } });
    if (!record) throw new NotFoundException("Release record not found");
    return record;
  }

  async create(actor: ActorContext, dto: CreateReleaseRecordDto, context: RequestContext): Promise<MahalluReleaseRecord> {
    const record = await this.prisma.mahalluReleaseRecord.create({
      data: { ...toData(dto), tenantId: actor.tenantId } as Prisma.MahalluReleaseRecordUncheckedCreateInput
    });
    await this.audit.record({
      actorUserId: actor.userId,
      tenantId: actor.tenantId,
      action: "registers.release.create",
      targetType: "MahalluReleaseRecord",
      targetId: record.id,
      ipAddress: context.ipAddress,
      userAgent: context.userAgent
    });
    return record;
  }

  async update(actor: ActorContext, id: string, dto: UpdateReleaseRecordDto, context: RequestContext): Promise<MahalluReleaseRecord> {
    await this.findOne(actor.tenantId, id);
    const record = await this.prisma.mahalluReleaseRecord.update({ where: { id }, data: toData(dto) });
    await this.audit.record({
      actorUserId: actor.userId,
      tenantId: actor.tenantId,
      action: "registers.release.update",
      targetType: "MahalluReleaseRecord",
      targetId: record.id,
      ipAddress: context.ipAddress,
      userAgent: context.userAgent
    });
    return record;
  }

  async remove(actor: ActorContext, id: string, context: RequestContext): Promise<void> {
    await this.findOne(actor.tenantId, id);
    await this.prisma.mahalluReleaseRecord.delete({ where: { id } });
    await this.audit.record({
      actorUserId: actor.userId,
      tenantId: actor.tenantId,
      action: "registers.release.delete",
      targetType: "MahalluReleaseRecord",
      targetId: id,
      ipAddress: context.ipAddress,
      userAgent: context.userAgent
    });
  }

  async issueCertificate(actor: ActorContext, id: string, context: RequestContext): Promise<MahalluReleaseRecord> {
    const existing = await this.findOne(actor.tenantId, id);
    if (existing.certificateNumber) return existing;
    const certificateNumber = await this.certificates.nextNumber(actor.tenantId, "RELEASE", "REL");
    const record = await this.prisma.mahalluReleaseRecord.update({
      where: { id },
      data: { certificateNumber, certificateIssuedAt: new Date() }
    });
    await this.audit.record({
      actorUserId: actor.userId,
      tenantId: actor.tenantId,
      action: "registers.release.certificate.issue",
      targetType: "MahalluReleaseRecord",
      targetId: id,
      metadata: { certificateNumber },
      ipAddress: context.ipAddress,
      userAgent: context.userAgent
    });
    return record;
  }
}
