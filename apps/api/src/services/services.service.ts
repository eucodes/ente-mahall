import { Injectable, NotFoundException } from "@nestjs/common";
import type { Prisma, ServiceRequestStatus } from "@mahalle/database";
import { PrismaService } from "../database/prisma.service";
import { AuditService } from "../audit/audit.service";
import type { CreateServiceRequestDto } from "./dto/create-service-request.dto";
import type { UpdateServiceRequestDto } from "./dto/update-service-request.dto";

interface RequestContext {
  ipAddress?: string;
  userAgent?: string;
}
interface ActorContext {
  userId: string;
  tenantId: string;
}

const INCLUDE = {
  member: { select: { id: true, fullName: true } },
  event: { select: { id: true, title: true } },
  assignedTo: { select: { id: true, fullName: true } }
} as const;
export type ServiceRequestWithDetail = Prisma.ServiceRequestGetPayload<{ include: typeof INCLUDE }>;

@Injectable()
export class ServicesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService
  ) {}

  async list(
    tenantId: string,
    page: number,
    pageSize: number,
    status?: ServiceRequestStatus
  ): Promise<{ requests: ServiceRequestWithDetail[]; total: number }> {
    const where = { tenantId, ...(status ? { status } : {}) };
    const [requests, total] = await Promise.all([
      this.prisma.serviceRequest.findMany({ where, orderBy: { createdAt: "desc" }, skip: (page - 1) * pageSize, take: pageSize, include: INCLUDE }),
      this.prisma.serviceRequest.count({ where })
    ]);
    return { requests, total };
  }

  async findOne(tenantId: string, id: string): Promise<ServiceRequestWithDetail> {
    const request = await this.prisma.serviceRequest.findFirst({ where: { id, tenantId }, include: INCLUDE });
    if (!request) throw new NotFoundException("Service request not found");
    return request;
  }

  async create(actor: ActorContext, dto: CreateServiceRequestDto, context: RequestContext): Promise<ServiceRequestWithDetail> {
    const request = await this.prisma.serviceRequest.create({
      data: { ...dto, tenantId: actor.tenantId },
      include: INCLUDE
    });
    await this.audit.record({
      actorUserId: actor.userId,
      tenantId: actor.tenantId,
      action: "services.request.create",
      targetType: "ServiceRequest",
      targetId: request.id,
      ipAddress: context.ipAddress,
      userAgent: context.userAgent
    });
    return request;
  }

  async update(actor: ActorContext, id: string, dto: UpdateServiceRequestDto, context: RequestContext): Promise<ServiceRequestWithDetail> {
    await this.findOne(actor.tenantId, id);
    const request = await this.prisma.serviceRequest.update({ where: { id }, data: dto, include: INCLUDE });
    await this.audit.record({
      actorUserId: actor.userId,
      tenantId: actor.tenantId,
      action: "services.request.update",
      targetType: "ServiceRequest",
      targetId: id,
      metadata: dto.status ? { status: dto.status } : undefined,
      ipAddress: context.ipAddress,
      userAgent: context.userAgent
    });
    return request;
  }

  async remove(actor: ActorContext, id: string, context: RequestContext): Promise<void> {
    await this.findOne(actor.tenantId, id);
    await this.prisma.serviceRequest.delete({ where: { id } });
    await this.audit.record({
      actorUserId: actor.userId,
      tenantId: actor.tenantId,
      action: "services.request.delete",
      targetType: "ServiceRequest",
      targetId: id,
      ipAddress: context.ipAddress,
      userAgent: context.userAgent
    });
  }
}
