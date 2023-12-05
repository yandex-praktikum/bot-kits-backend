import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import {
  Statistics,
  StatisticsDocument,
} from '../statistics/schema/statistics.schema';

@Injectable()
export class StatisticsRepository {
  constructor(
    @InjectModel(Statistics.name)
    private statisticsModel: Model<StatisticsDocument>,
  ) {}

  async findAll(): Promise<Statistics[]> {
    try {
      const statistics = await this.statisticsModel.find();
      if (statistics.length === 0)
        throw new NotFoundException('Нет не одной статистики');
      return statistics;
    } catch (error) {
      throw new NotFoundException(error.message || 'Что-то пошло не так');
    }
  }
}
