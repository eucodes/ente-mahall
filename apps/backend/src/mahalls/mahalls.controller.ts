import { Controller, Get, Param } from '@nestjs/common';
import { MahallsService } from './mahalls.service.js';

@Controller('mahalls')
export class MahallsController {
  constructor(private readonly mahallsService: MahallsService) {}

  @Get(':slug')
  findBySlug(@Param('slug') slug: string) {
    return this.mahallsService.findBySlug(slug);
  }
}
