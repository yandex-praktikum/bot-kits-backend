import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Tariff } from './schema/tariff.schema';
import mongoose, { Model } from 'mongoose';
import { CreateTariffDto } from './dto/create-tariff.dto';
import { UpdateTariffDto } from './dto/update-tariff.dto';

@Injectable()
export class TariffsRepository {
  constructor(@InjectModel(Tariff.name) private tariff: Model<Tariff>) {}

  async create(createTariffDto: CreateTariffDto): Promise<Tariff> {
    try {
      return await this.tariff.create(createTariffDto);
    } catch (err) {
      if (err.code === 11000) {
        throw new ConflictException('Такой тариф уже существует');
      }
    }
  }

  async findOne(id: string): Promise<Tariff> {
    try {
      const tariff = await this.tariff.findById(id).exec();
      if (!tariff) throw new NotFoundException('Тарифа с таким id нет');
      return tariff;
    } catch (error) {
      throw new NotFoundException('Тарифа с таким id нет');
    }
  }

  async findAll(session?: mongoose.ClientSession): Promise<Tariff[]> {
    try {
      const tariffs = await this.tariff.find().session(session).exec();
      if (tariffs.length === 0)
        throw new NotFoundException('Нет ни одного тарифа');
      return tariffs;
    } catch (error) {
      throw new NotFoundException('Что-то пошло не так');
    }
  }

  async updateTariff(id: string, updateTariffDto: UpdateTariffDto) {
    try {
      const tariff = await this.tariff.findByIdAndUpdate(
        id,
        {
          ...updateTariffDto,
        },
        { new: true },
      );
      return tariff;
    } catch (error) {
      throw new NotFoundException('Тарифа с таким id нет');
    }
  }

  async remove(id: string): Promise<Tariff> {
    try {
      const tariff = await this.tariff.findByIdAndDelete(id).exec();
      if (!tariff) {
        throw new NotFoundException('Тариф не найден');
      }
      return tariff;
    } catch (error) {
      throw new NotFoundException('Тарифа с таким названием нет');
    }
  }
}
