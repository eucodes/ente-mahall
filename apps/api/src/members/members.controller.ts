import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Query, Req, UseGuards } from "@nestjs/common";
import type { Request } from "express";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { TenantContextGuard } from "../tenants/guards/tenant-context.guard";
import { PermissionGuard } from "../tenants/guards/permission.guard";
import { RequirePermission } from "../common/decorators/require-permission.decorator";
import { CurrentMembership } from "../tenants/decorators/current-membership.decorator";
import type { MembershipWithRole } from "../memberships/memberships.service";
import { MembersService } from "./members.service";
import { CreateMemberDto } from "./dto/create-member.dto";
import { UpdateMemberDto } from "./dto/update-member.dto";
import { ListMembersQueryDto } from "./dto/list-members-query.dto";

function requestContext(req: Request) {
  return { ipAddress: req.ip, userAgent: req.headers["user-agent"] };
}

@Controller("tenants/:slug/members")
@UseGuards(JwtAuthGuard, TenantContextGuard, PermissionGuard)
export class MembersController {
  constructor(private readonly membersService: MembersService) {}

  @Get()
  @RequirePermission("members.view")
  async list(@CurrentMembership() membership: MembershipWithRole, @Query() query: ListMembersQueryDto) {
    const { members, total } = await this.membersService.list(membership.tenantId, query.page, query.pageSize, {
      familyId: query.familyId,
      isYatheem: query.isYatheem,
      isExpatriate: query.isExpatriate,
      bloodGroup: query.bloodGroup,
      movementStatus: query.movementStatus,
      divisionId: query.divisionId
    });
    return { members, meta: { page: query.page, pageSize: query.pageSize, total } };
  }

  @Get(":memberId")
  @RequirePermission("members.view")
  async findOne(@CurrentMembership() membership: MembershipWithRole, @Param("memberId") memberId: string) {
    const member = await this.membersService.findOne(membership.tenantId, memberId);
    return { member };
  }

  @Post()
  @RequirePermission("members.create")
  async create(
    @CurrentMembership() membership: MembershipWithRole,
    @Body() dto: CreateMemberDto,
    @Req() req: Request
  ) {
    const member = await this.membersService.create(
      { userId: membership.userId, tenantId: membership.tenantId },
      dto,
      requestContext(req)
    );
    return { member };
  }

  @Patch(":memberId")
  @RequirePermission("members.update")
  @HttpCode(HttpStatus.OK)
  async update(
    @CurrentMembership() membership: MembershipWithRole,
    @Param("memberId") memberId: string,
    @Body() dto: UpdateMemberDto,
    @Req() req: Request
  ) {
    const member = await this.membersService.update(
      { userId: membership.userId, tenantId: membership.tenantId },
      memberId,
      dto,
      requestContext(req)
    );
    return { member };
  }

  @Delete(":memberId")
  @RequirePermission("members.delete")
  @HttpCode(HttpStatus.OK)
  async remove(
    @CurrentMembership() membership: MembershipWithRole,
    @Param("memberId") memberId: string,
    @Req() req: Request
  ) {
    await this.membersService.remove(
      { userId: membership.userId, tenantId: membership.tenantId },
      memberId,
      requestContext(req)
    );
    return { success: true };
  }
}
