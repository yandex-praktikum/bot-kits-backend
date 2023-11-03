import { Controller, Get } from '@nestjs/common';
import { StatisticsService } from './statistics.service';
import { Statistics } from './schema/statistics.schema';

@Controller('statistics')
export class StatisticsController {
  constructor(private readonly statisticsService: StatisticsService) {}
  @Get()
  findAll(): Promise<Statistics[]> {
    return this.statisticsService.findAll();
  }
}
