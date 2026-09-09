import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import type { CreatePlanDto } from './dto/plan.dto.js';

@Injectable()
export class PlansService {
  constructor(private readonly prisma: PrismaService) {}

  // Public: shown on the marketing site's pricing page and the tenant-creation form.
  findActive() {
    return this.prisma.plan.findMany({ where: { isActive: true }, orderBy: { priceCents: 'asc' } });
  }

  create(dto: CreatePlanDto) {
    return this.prisma.plan.create({ data: dto });
  }
}
