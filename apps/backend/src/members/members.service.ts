import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import type { CreateMemberDto } from './dto/member.dto.js';

@Injectable()
export class MembersService {
  constructor(private readonly prisma: PrismaService) {}

  findAllForMahall(mahallId: string) {
    return this.prisma.member.findMany({ where: { mahallId }, orderBy: { fullName: 'asc' } });
  }

  create(mahallId: string, dto: CreateMemberDto) {
    return this.prisma.member.create({
      data: { mahallId, ...dto },
    });
  }
}
