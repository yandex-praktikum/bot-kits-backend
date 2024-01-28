import { Injectable } from '@nestjs/common';

import { CreateTariffDto } from './dto/create-tariff.dto';
import { UpdateTariffDto } from './dto/update-tariff.dto';
import { Tariff } from './schema/tariff.schema';
import { TariffsRepository } from './tariffs.repository';
import mongoose from 'mongoose';

@Injectable()
export class TariffsService {
  constructor(private readonly dbQuery: TariffsRepository) {}

  async create(createTariffDto: CreateTariffDto): Promise<Tariff> {
    return await this.dbQuery.create(createTariffDto);
  }

  async findOne(id: string): Promise<Tariff> {
    return await this.dbQuery.findOne(id);
  }

  async findAll(session?: mongoose.ClientSession): Promise<Tariff[]> {
    return await this.dbQuery.findAll(session);
  }

  async updateTariff(id: string, updateTariffDto: UpdateTariffDto) {
    return await this.dbQuery.updateTariff(id, updateTariffDto);
  }

  async remove(id: string): Promise<Tariff> {
    return await this.dbQuery.remove(id);
  }
}
