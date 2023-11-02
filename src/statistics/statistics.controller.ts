import { Controller } from '@nestjs/common';
import { StatisticsService } from './statistics.service';

@Controller('platforms')
export class StatisticsController {
  constructor(private readonly statisticsService: StatisticsService) {}
}
