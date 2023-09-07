import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateTariffDto } from './dto/tariff.dto';
import { Tariff } from './entities/tariff.entity';

@Injectable()
export class TariffService {
  constructor(@InjectModel(Tariff.name) private tariff: Model<Tariff>) {}

  async create(CreateTariffDto: CreateTariffDto): Promise<Tariff> {
    try {
      const tariff = await this.tariff.create({
        ...CreateTariffDto,
      });
      return await tariff.save();
    } catch (err) {
      if (err.code === 11000) {
        throw new ConflictException('Такой тариф уже существует');
      }
    }
  }

  async findOne(id: string): Promise<Tariff> {
    const tariff = await this.tariff.findById({ id }).exec();
    return tariff;
  }

  async findByTariffName(name: string): Promise<Tariff | null> {
    const tariff = await this.tariff.findOne({ name: name });
    if (tariff) {
      return tariff;
    } else {
      return null;
    }
  }

  async remove(id: string): Promise<Tariff> {
    const tariff = await this.tariff.findByIdAndDelete(id).exec();
    if (tariff) {
      return tariff;
    } else {
      throw new NotFoundException('Тарифа с таким id нет');
    }
  }
}
