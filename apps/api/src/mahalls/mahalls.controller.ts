import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { UserRole } from '@prisma/client';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { JwtAccessGuard } from '../auth/guards/jwt-access.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { CreateMahallDto } from './dto/mahall.dto.js';
import { MahallsService } from './mahalls.service.js';

@Controller('mahalls')
export class MahallsController {
  constructor(private readonly mahallsService: MahallsService) {}

  // Public: the web app's middleware calls this to resolve a subdomain to a tenant.
  @Get(':slug')
  findBySlug(@Param('slug') slug: string) {
    return this.mahallsService.findBySlug(slug);
  }

  @Get()
  @UseGuards(JwtAccessGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN)
  findAll() {
    return this.mahallsService.findAll();
  }

  @Post()
  @UseGuards(JwtAccessGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN)
  create(@Body() dto: CreateMahallDto) {
    return this.mahallsService.create(dto);
  }
}
