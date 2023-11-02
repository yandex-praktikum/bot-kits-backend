import { Injectable } from '@nestjs/common';
import { Statistics } from './schema/statistics.schema';
import { StatisticsRepository } from './statistics.repository';

@Injectable()
export class StatisticsService {
  constructor(private readonly dbQuery: StatisticsRepository) {}

  async findAll(): Promise<Statistics[]> {
    return await this.dbQuery.findAll();
  }
}
