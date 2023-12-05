import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { MongoServerError } from 'mongodb';
import { CreatePromocodeDto } from './dto/create-promocode.dto';
import { UpdatePromocodeDto } from './dto/update-promocode.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Promocode } from './schema/promocode.schema';
import { Model } from 'mongoose';

@Injectable()
export class PromocodesRepository {
  constructor(
    @InjectModel(Promocode.name) private promocodes: Model<Promocode>,
  ) {}

  async create(createPromocodeDto: CreatePromocodeDto) {
    try {
      const promocode = await this.promocodes.create({
        ...createPromocodeDto,
      });
      return await promocode.save();
    } catch (error) {
      if (error instanceof MongoServerError && error.code === 11000) {
        throw new ConflictException('Такой промокод уже существует');
      }
      //500й код
      throw new Error('Что-то пошло не так');
    }
  }

  async findAll(): Promise<Promocode[]> {
    try {
      const promocodes = await this.promocodes.find();
      if (promocodes.length === 0) {
        throw new NotFoundException('Нет ни одного промокода');
      }
      return promocodes;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      //500й код
      throw new Error('Что-то пошло не так');
    }
  }

  async findOne(id: string): Promise<Promocode> {
    try {
      const promocode = await this.promocodes.findById({ _id: id }).exec();
      return promocode;
    } catch (error) {
      if (~error.message.indexOf('Cast to ObjectId failed')) {
        throw new NotFoundException('Промокода с таким id нет');
      }
      //500й код
      throw new Error('Что-то пошло не так');
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
      if (~error.message.indexOf('Cast to ObjectId failed')) {
        throw new NotFoundException('Промокода с таким id нет');
      }
      //500й код
      throw new Error('Что-то пошло не так');
    }
  }

  async findOneByCode(code: string): Promise<Promocode> {
    try {
      const promocode = await this.promocodes.findOne({ code: code }).exec();
      //по умолчанию findOne возвращает null, а не ошибку
      if (!promocode) {
        throw new NotFoundException('Промокода с таким названием нет');
      }
      return promocode;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      //500й код
      throw new Error('Что-то пошло не так');
    }
  }

  async updateByCode(code: string) {
    try {
      const promocodeToCheck = await this.findOneByCode(code);
      const curDate = new Date();
      if (!promocodeToCheck) {
        throw new NotFoundException('Промокод не найден');
      }

      if (
        promocodeToCheck.activationCount >= promocodeToCheck.maxActivationCount
      ) {
        throw new HttpException(
          'Количество активаций исчерпано',
          HttpStatus.BAD_REQUEST,
        );
      }

      if (promocodeToCheck.actionPeriod < curDate) {
        throw new HttpException(
          'Промокод не действителен',
          HttpStatus.BAD_REQUEST,
        );
      }
      const promocode = await this.promocodes.findOneAndUpdate(
        { code: code },
        {
          $inc: { activationCount: 1 },
        },
        { new: true },
      );
      return promocode;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      if (error instanceof HttpException) throw error;
      //500й код
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
      if (error instanceof NotFoundException) throw error;
      //500й код
      throw new Error('Что-то пошло не так');
    }
  }
}
