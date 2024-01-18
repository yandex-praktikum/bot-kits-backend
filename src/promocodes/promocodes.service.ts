import { Injectable } from '@nestjs/common';
import { CreatePromocodeDto } from './dto/create-promocode.dto';
import { UpdatePromocodeDto } from './dto/update-promocode.dto';
import { Promocode } from './schema/promocode.schema';
import { PromocodesRepository } from './promocodes.repository';

@Injectable()
export class PromocodesService {
  constructor(private readonly dbQuery: PromocodesRepository) {}

  async create(createPromocodeDto: CreatePromocodeDto): Promise<Promocode> {
    return await this.dbQuery.create(createPromocodeDto);
  }

  async findAll(): Promise<Promocode[]> {
    return await this.dbQuery.findAll();
  }

  async findOne(id: string): Promise<Promocode> {
    return await this.dbQuery.findOne(id);
  }

  async update(id: string, updatePromocodeDto: UpdatePromocodeDto) {
    return await this.dbQuery.update(id, updatePromocodeDto);
  }

  async findOneByCode(code: string): Promise<Promocode> {
    return await this.dbQuery.findOneByCode(code);
  }

  async updateByCode(code: string, userId: string) {
    return await this.dbQuery.updateByCode(code, userId);
  }

  async remove(id: string): Promise<Promocode> {
    return await this.dbQuery.remove(id);
  }
}
