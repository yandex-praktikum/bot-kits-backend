import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateTariffDto } from './dto/create-tariff.dto';
import { Tariff } from './entities/tariff.entity';
import { UpdateTariffDto } from './dto/update-tariff.dto';

@Injectable()
export class TariffsService {
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
    try {
      const tariff = await this.tariff.findById({ _id: id }).exec();
      return tariff;
    } catch (error) {
      throw new NotFoundException('Тарифа с таким id нет');
    }
  }

  async findAll(): Promise<Tariff[]> {
    try {
      const tariffs = await this.tariff.find().exec();
      return tariffs;
    } catch (error) {
      throw new NotFoundException('Нет ни одного тарифа');
    }
  }

  async updateTariff(id: string, updateTariffDto: UpdateTariffDto) {
    try {
      const tariff = await this.tariff.findByIdAndUpdate(id, {
        ...updateTariffDto,
      });
      return tariff;
    } catch (error) {
      throw new Error('Что-то пошло не так');
    }
  }

  async remove(id: string): Promise<Tariff> {
    try {
      const tariff = await this.tariff.findByIdAndDelete(id).exec();
      return tariff;
    } catch (error) {
      throw new NotFoundException('Тарифа с таким названием нет');
    }
  }
}
