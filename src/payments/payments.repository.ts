import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Payment, PaymentDocument } from './schema/payment.schema';
import { Model, Types } from 'mongoose';
import { CreatePaymentDto } from './dto/create-payment.dto';
import TypeOperation from './types/type-operation';
import { ProfilesService } from 'src/profiles/profiles.service';

export abstract class RepositoryPort {
  abstract create(userId: string, data: CreatePaymentDto): Promise<Payment>;
  abstract delete(data: string): Promise<Payment>;
  abstract findOne(data: string): Promise<Payment>;
  abstract findAll(): Promise<Payment[]>;
  abstract findUsersAll(data: Types.ObjectId): Promise<Payment[]>;
  abstract update(id: string, data: CreatePaymentDto): Promise<Payment>;
}

@Injectable()
export class PaymentsRepository extends RepositoryPort {
  constructor(
    @InjectModel(Payment.name)
    private paymentModel: Model<PaymentDocument>,
    private profileServise: ProfilesService,
  ) {
    super();
  }

  //-- Функция для создания платежа, изменения баланса профиля и сохранения информации о платеже в базе данных --//
  async create(
    userId: string,
    createPaymentDto: CreatePaymentDto,
  ): Promise<Payment> {
    //-- Поиск профиля пользователя по ID --//
    const profile = await this.profileServise.findById(userId);

    //-- Определение типа операции платежа и выполнение соответствующей логики --//
    switch (createPaymentDto.operation) {
      case TypeOperation.INCOME:
        //-- Логика для обработки случая "Поступление" средств на счет пользователя --//
        profile.balance += createPaymentDto.amount; // Увеличиваем баланс
        await profile.save();
        //-- Создаем запись о платеже в базе данных и возвращаем ее --//
        return await this.paymentModel.create({
          profile: userId,
          ...createPaymentDto,
        });

      case TypeOperation.OUTGONE:
        //-- Логика для обработки случая "Списание" средств с счета пользователя --//
        //-- Проверяем достаточность средств на балансе и успешность операции --//
        if (
          profile.balance < createPaymentDto.amount ||
          createPaymentDto.successful === false
        ) {
          //-- В случае недостаточности средств, создаем запись о платеже с соответствующей отметкой --//
          return await this.paymentModel.create({
            profile: userId,
            ...createPaymentDto,
            note: 'Недостаточно средств', //-- Добавляем примечание о недостаточности средств --//
          });
        }
        profile.balance -= createPaymentDto.amount; //-- Уменьшаем баланс --//
        await profile.save();
        //-- Создаем запись о платеже в базе данных и возвращаем ее --//
        return await this.paymentModel.create({
          profile: userId,
          ...createPaymentDto,
        });

      default:
        //-- Логика для обработки других неопределенных случаев (пока не реализована) --//
        break;
    }
  }

  async delete(id: string): Promise<Payment> {
    //Не проверяем принадлежность операции пользователю, поскольку метод для администрирования, а не фронта
    return await this.paymentModel.findByIdAndRemove(id).exec();
  }

  async findOne(id: string): Promise<Payment> {
    return this.paymentModel.findById(id).exec();
  }

  async findAll(): Promise<Payment[]> {
    return await this.paymentModel.find().exec();
  }

  async findUsersAll(userId: Types.ObjectId): Promise<Payment[]> {
    return await this.paymentModel.find({ 'profile._id': userId }).exec();
  }

  async update(
    id: string,
    updatePaymentDto: CreatePaymentDto,
  ): Promise<Payment> {
    //Не проверяем принадлежность операции пользователю, поскольку метод для администрирования, а не фронта
    return await this.paymentModel.findByIdAndUpdate(id, updatePaymentDto, {
      new: true,
      runValidators: true,
    });
  }
}
