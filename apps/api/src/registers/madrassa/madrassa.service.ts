import { Injectable, NotFoundException } from "@nestjs/common";
import type { MadrassaEnrollment, Prisma } from "@mahalle/database";
import { PrismaService } from "../../database/prisma.service";
import { AuditService } from "../../audit/audit.service";
import type { CreateMadrassaEnrollmentDto } from "./dto/create-madrassa-enrollment.dto";
import type { UpdateMadrassaEnrollmentDto } from "./dto/update-madrassa-enrollment.dto";

interface RequestContext {
  ipAddress?: string;
  userAgent?: string;
}
interface ActorContext {
  userId: string;
  tenantId: string;
}

function toData(dto: Partial<CreateMadrassaEnrollmentDto>) {
  const { admissionDate, ...rest } = dto;
  return { ...rest, ...(admissionDate !== undefined && { admissionDate: new Date(admissionDate) }) };
}

@Injectable()
export class MadrassaService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService
  ) {}

  async list(tenantId: string, page: number, pageSize: number): Promise<{ records: MadrassaEnrollment[]; total: number }> {
    const where = { tenantId, isActive: true };
    const [records, total] = await Promise.all([
      this.prisma.madrassaEnrollment.findMany({ where, orderBy: { studentName: "asc" }, skip: (page - 1) * pageSize, take: pageSize }),
      this.prisma.madrassaEnrollment.count({ where })
    ]);
    return { records, total };
  }

  async findOne(tenantId: string, id: string): Promise<MadrassaEnrollment> {
    const record = await this.prisma.madrassaEnrollment.findFirst({ where: { id, tenantId, isActive: true } });
    if (!record) throw new NotFoundException("Enrollment not found");
    return record;
  }

  async create(actor: ActorContext, dto: CreateMadrassaEnrollmentDto, context: RequestContext): Promise<MadrassaEnrollment> {
    const record = await this.prisma.madrassaEnrollment.create({
      data: { ...toData(dto), tenantId: actor.tenantId } as Prisma.MadrassaEnrollmentUncheckedCreateInput
    });
    await this.audit.record({
      actorUserId: actor.userId,
      tenantId: actor.tenantId,
      action: "registers.madrassa.create",
      targetType: "MadrassaEnrollment",
      targetId: record.id,
      ipAddress: context.ipAddress,
      userAgent: context.userAgent
    });
    return record;
  }

  async update(actor: ActorContext, id: string, dto: UpdateMadrassaEnrollmentDto, context: RequestContext): Promise<MadrassaEnrollment> {
    await this.findOne(actor.tenantId, id);
    const record = await this.prisma.madrassaEnrollment.update({ where: { id }, data: toData(dto) });
    await this.audit.record({
      actorUserId: actor.userId,
      tenantId: actor.tenantId,
      action: "registers.madrassa.update",
      targetType: "MadrassaEnrollment",
      targetId: record.id,
      ipAddress: context.ipAddress,
      userAgent: context.userAgent
    });
    return record;
  }

  async remove(actor: ActorContext, id: string, context: RequestContext): Promise<void> {
    await this.findOne(actor.tenantId, id);
    await this.prisma.madrassaEnrollment.update({ where: { id }, data: { isActive: false } });
    await this.audit.record({
      actorUserId: actor.userId,
      tenantId: actor.tenantId,
      action: "registers.madrassa.delete",
      targetType: "MadrassaEnrollment",
      targetId: id,
      ipAddress: context.ipAddress,
      userAgent: context.userAgent
    });
  }
}
