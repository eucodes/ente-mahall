import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class MahallsService {
  constructor(private readonly prisma: PrismaService) {}

  async findBySlug(slug: string) {
    const mahall = await this.prisma.mahall.findUnique({ where: { slug } });
    if (!mahall) throw new NotFoundException('Mahall not found');
    return mahall;
  }
}
