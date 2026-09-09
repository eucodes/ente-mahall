import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import type { CreateMahallDto } from './dto/mahall.dto.js';

@Injectable()
export class MahallsService {
  constructor(private readonly prisma: PrismaService) {}

  /** Public tenant lookup — used by the web app's middleware to resolve a subdomain. */
  async findBySlug(slug: string) {
    const mahall = await this.prisma.mahall.findUnique({ where: { slug } });
    if (!mahall) throw new NotFoundException('Mahall not found');
    return mahall;
  }

  findAll() {
    return this.prisma.mahall.findMany({ orderBy: { createdAt: 'desc' } });
  }

  /** Super Admin only — creates a tenant and its initial subscription in one transaction. */
  async create(dto: CreateMahallDto) {
    const existing = await this.prisma.mahall.findUnique({ where: { slug: dto.slug } });
    if (existing) throw new ConflictException('This subdomain is already taken');

    const plan = await this.prisma.plan.findUnique({ where: { id: dto.planId } });
    if (!plan) throw new NotFoundException('Plan not found');

    return this.prisma.mahall.create({
      data: {
        name: dto.name,
        slug: dto.slug,
        address: dto.address,
        phone: dto.phone,
        email: dto.email,
        subscription: {
          create: {
            planId: plan.id,
            currentPeriodEnd: new Date(Date.now() + 14 * 86_400_000), // 14-day trial
          },
        },
      },
      include: { subscription: true },
    });
  }
}
