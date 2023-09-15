import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePromocodeDto } from './dto/create-promocode.dto';
import { UpdatePromocodeDto } from './dto/update-promocode.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Promocode } from './schema/promocode.schema';
import { Model } from 'mongoose';

@Injectable()
export class PromocodesService {
  constructor(
    @InjectModel(Promocode.name) private promocodes: Model<Promocode>,
  ) {}

  async create(createPromocodeDto: CreatePromocodeDto) {
    try {
      const promocode = await this.promocodes.create({
        ...createPromocodeDto,
      });
      return await promocode.save();
    } catch (err) {
      if (err.code === 11000) {
        throw new ConflictException('Такой промокод уже существует');
      }
    }
  }

  async findAll(): Promise<Promocode[]> {
    try {
      const promocodes = await this.promocodes.find().exec();
      return promocodes;
    } catch (error) {
      throw new NotFoundException('Нет ни одного промокода');
    }
  }

  async findOne(id: string): Promise<Promocode> {
    try {
      const promocode = await this.promocodes.findById({ _id: id }).exec();
      return promocode;
    } catch (error) {
      throw new NotFoundException('Промокода с таким id нет');
    }
  }

  async update(id: string, updatePromocodeDto: UpdatePromocodeDto) {
    try {
      const promocode = await this.promocodes.findByIdAndUpdate(
        id,
        {
          ...updatePromocodeDto,
        },
        { new: true },
      );
      return promocode;
    } catch (error) {
      throw new Error('Что-то пошло не так');
    }
  }

  async remove(id: string) {
    try {
      const promocode = await this.promocodes.findByIdAndDelete(id).exec();
      //сразу после удаления промокод будет равен null
      if (!promocode) {
        throw new NotFoundException('Промокода с таким id нет');
      }

      return promocode;
    } catch (error) {
      throw new NotFoundException('Промокода с таким id нет');
    }
  }
}
