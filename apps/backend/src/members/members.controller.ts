import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { UserRole } from '@prisma/client';
import { CurrentUser } from '../auth/decorators/current-user.decorator.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { JwtAccessGuard } from '../auth/guards/jwt-access.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import type { JwtAccessPayload } from '../auth/jwt-payload.js';
import { CreateMemberDto } from './dto/member.dto.js';
import { MembersService } from './members.service.js';

@Controller('members')
@UseGuards(JwtAccessGuard, RolesGuard)
export class MembersController {
  constructor(private readonly membersService: MembersService) {}

  @Get()
  findAll(@CurrentUser() user: JwtAccessPayload) {
    return this.membersService.findAllForMahall(user.mahallId);
  }

  @Post()
  @Roles(UserRole.MAHALL_ADMIN, UserRole.STAFF)
  create(@CurrentUser() user: JwtAccessPayload, @Body() dto: CreateMemberDto) {
    return this.membersService.create(user.mahallId, dto);
  }
}
