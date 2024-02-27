import { Controller, Get, UseGuards } from '@nestjs/common';
import { StatisticsService } from './statistics.service';
import { Statistics } from './schema/statistics.schema';
import { Action } from 'src/ability/ability.factory';
import { CheckAbility } from 'src/auth/decorators/ability.decorator';
import { AbilityGuard } from 'src/auth/guards/ability.guard';
import { JwtGuard } from 'src/auth/guards/jwtAuth.guards';

@UseGuards(JwtGuard)
@Controller('statistics')
export class StatisticsController {
  constructor(private readonly statisticsService: StatisticsService) {}

  @CheckAbility({ action: Action.Read, subject: Statistics })
  @UseGuards(AbilityGuard)
  @Get()
  findAll(): Promise<Statistics[]> {
    return this.statisticsService.findAll();
  }
}
