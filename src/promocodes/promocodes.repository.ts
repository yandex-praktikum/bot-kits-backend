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
import { Profile } from 'src/profiles/schema/profile.schema';
import { Payment } from 'src/payments/schema/payment.schema';
import { createPaymentData } from 'src/utils/utils';
import TypeOperation from 'src/payments/types/type-operation';

@Injectable()
export class PromocodesRepository {
  constructor(
    @InjectModel(Promocode.name) private promocodes: Model<Promocode>,
    @InjectModel(Profile.name) private profileModel: Model<Profile>,
    @InjectModel(Payment.name) private paymentModel: Model<Payment>,
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

  async updateByCode(code: string, userId: string) {
    try {
      // Поиск промокода по коду
      const promocodeToCheck = await this.findOneByCode(code);
      const curDate = new Date();

      // Проверка на наличие промокода
      if (!promocodeToCheck) {
        throw new NotFoundException('Промокод не найден');
      }

      // Проверка, не исчерпано ли максимальное количество активаций промокода
      if (
        promocodeToCheck.activationCount >= promocodeToCheck.maxActivationCount
      ) {
        throw new HttpException(
          'Количество активаций исчерпано',
          HttpStatus.BAD_REQUEST,
        );
      }

      // Проверка срока действия промокода
      if (promocodeToCheck.actionPeriod <= curDate) {
        throw new HttpException(
          'Промокод не действителен',
          HttpStatus.BAD_REQUEST,
        );
      }

      // Получение профиля пользователя по его ID
      const profile = await this.profileModel.findById(userId);

      // Проверка, был ли промокод уже использован пользователем
      if (profile.promocode.includes(code)) {
        throw new ConflictException('Промокод уже использован');
      }

      // Увеличение счетчика активаций промокода и его обновление
      const promocode = await this.promocodes.findOneAndUpdate(
        { code: code },
        { $inc: { activationCount: 1 } },
        { new: true },
      );

      // Увеличение баланса пользователя на сумму промокода и добавление кода в список использованных
      profile.balance += promocodeToCheck.amount;
      profile.promocode.push(promocode.code);
      await profile.save();
      const paymenstData = await createPaymentData(
        new Date(),
        promocode.amount,
        true,
        TypeOperation.INCOME,
        'Активация промокода',
        profile.toObject(),
        undefined,
        promocode.toObject(),
      );

      // Создание записи о платеже за активацию промокода
      await this.paymentModel.create(paymenstData);

      // Возвращение обновленного промокода
      return promocode;
    } catch (error) {
      // Обработка возникающих исключений
      if (error instanceof NotFoundException) throw error;
      if (error instanceof HttpException) throw error;
      // Обработка неизвестной ошибки
      console.log(error.message);
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
