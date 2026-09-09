import { Module } from '@nestjs/common';
import { MahallsController } from './mahalls.controller.js';
import { MahallsService } from './mahalls.service.js';

@Module({
  controllers: [MahallsController],
  providers: [MahallsService],
  exports: [MahallsService],
})
export class MahallsModule {}
