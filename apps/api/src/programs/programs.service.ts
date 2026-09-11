import { Injectable, NotFoundException } from "@nestjs/common";
import type { Program } from "@mahalle/database";
import { PrismaService } from "../database/prisma.service";
import { AuditService } from "../audit/audit.service";
import type { CreateProgramDto } from "./dto/create-program.dto";
import type { UpdateProgramDto } from "./dto/update-program.dto";

interface RequestContext {
  ipAddress?: string;
  userAgent?: string;
}

interface ActorContext {
  userId: string;
  tenantId: string;
}

/** Same tenant-scoping pattern as MembersService — see its comment for why. */
@Injectable()
export class ProgramsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService
  ) {}

  async list(tenantId: string, page: number, pageSize: number): Promise<{ programs: Program[]; total: number }> {
    const [programs, total] = await Promise.all([
      this.prisma.program.findMany({
        where: { tenantId, isActive: true },
        orderBy: { name: "asc" },
        skip: (page - 1) * pageSize,
        take: pageSize
      }),
      this.prisma.program.count({ where: { tenantId, isActive: true } })
    ]);
    return { programs, total };
  }

  async findOne(tenantId: string, programId: string): Promise<Program> {
    const program = await this.prisma.program.findFirst({ where: { id: programId, tenantId, isActive: true } });
    if (!program) {
      throw new NotFoundException("Program not found");
    }
    return program;
  }

  async create(actor: ActorContext, dto: CreateProgramDto, context: RequestContext): Promise<Program> {
    const program = await this.prisma.program.create({ data: { ...dto, tenantId: actor.tenantId } });
    await this.audit.record({
      actorUserId: actor.userId,
      tenantId: actor.tenantId,
      action: "program.create",
      targetType: "Program",
      targetId: program.id,
      ipAddress: context.ipAddress,
      userAgent: context.userAgent
    });
    return program;
  }

  async update(actor: ActorContext, programId: string, dto: UpdateProgramDto, context: RequestContext): Promise<Program> {
    await this.findOne(actor.tenantId, programId);
    const program = await this.prisma.program.update({ where: { id: programId }, data: dto });
    await this.audit.record({
      actorUserId: actor.userId,
      tenantId: actor.tenantId,
      action: "program.update",
      targetType: "Program",
      targetId: program.id,
      ipAddress: context.ipAddress,
      userAgent: context.userAgent
    });
    return program;
  }

  async remove(actor: ActorContext, programId: string, context: RequestContext): Promise<void> {
    await this.findOne(actor.tenantId, programId);
    await this.prisma.program.update({ where: { id: programId }, data: { isActive: false } });
    await this.audit.record({
      actorUserId: actor.userId,
      tenantId: actor.tenantId,
      action: "program.delete",
      targetType: "Program",
      targetId: programId,
      ipAddress: context.ipAddress,
      userAgent: context.userAgent
    });
  }
}
