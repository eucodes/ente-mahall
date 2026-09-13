import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Query, Req, UseGuards } from "@nestjs/common";
import type { Request } from "express";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { TenantContextGuard } from "../tenants/guards/tenant-context.guard";
import { FeatureGuard } from "../features/guards/feature.guard";
import { PermissionGuard } from "../tenants/guards/permission.guard";
import { RequirePermission } from "../common/decorators/require-permission.decorator";
import { RequireFeature } from "../common/decorators/require-feature.decorator";
import { CurrentMembership } from "../tenants/decorators/current-membership.decorator";
import type { MembershipWithRole } from "../memberships/memberships.service";
import { PaginationQueryDto } from "../common/dto/pagination-query.dto";
import { ProgramsService } from "./programs.service";
import { CreateProgramDto } from "./dto/create-program.dto";
import { UpdateProgramDto } from "./dto/update-program.dto";

function requestContext(req: Request) {
  return { ipAddress: req.ip, userAgent: req.headers["user-agent"] };
}

@Controller("tenants/:slug/programs")
@UseGuards(JwtAuthGuard, TenantContextGuard, FeatureGuard, PermissionGuard)
@RequireFeature("programs")
export class ProgramsController {
  constructor(private readonly programsService: ProgramsService) {}

  @Get()
  @RequirePermission("programs.view")
  async list(@CurrentMembership() membership: MembershipWithRole, @Query() query: PaginationQueryDto) {
    const { programs, total } = await this.programsService.list(membership.tenantId, query.page, query.pageSize);
    return { programs, meta: { page: query.page, pageSize: query.pageSize, total } };
  }

  @Get(":programId")
  @RequirePermission("programs.view")
  async findOne(@CurrentMembership() membership: MembershipWithRole, @Param("programId") programId: string) {
    return { program: await this.programsService.findOne(membership.tenantId, programId) };
  }

  @Post()
  @RequirePermission("programs.create")
  async create(@CurrentMembership() membership: MembershipWithRole, @Body() dto: CreateProgramDto, @Req() req: Request) {
    const program = await this.programsService.create(
      { userId: membership.userId, tenantId: membership.tenantId },
      dto,
      requestContext(req)
    );
    return { program };
  }

  @Patch(":programId")
  @RequirePermission("programs.update")
  @HttpCode(HttpStatus.OK)
  async update(
    @CurrentMembership() membership: MembershipWithRole,
    @Param("programId") programId: string,
    @Body() dto: UpdateProgramDto,
    @Req() req: Request
  ) {
    const program = await this.programsService.update(
      { userId: membership.userId, tenantId: membership.tenantId },
      programId,
      dto,
      requestContext(req)
    );
    return { program };
  }

  @Delete(":programId")
  @RequirePermission("programs.delete")
  @HttpCode(HttpStatus.OK)
  async remove(@CurrentMembership() membership: MembershipWithRole, @Param("programId") programId: string, @Req() req: Request) {
    await this.programsService.remove({ userId: membership.userId, tenantId: membership.tenantId }, programId, requestContext(req));
    return { success: true };
  }
}
