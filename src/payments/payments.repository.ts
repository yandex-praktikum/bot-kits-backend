import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Payment, PaymentDocument } from './schema/payment.schema';
import { Model, Types } from 'mongoose';
import { Profile } from '../profiles/schema/profile.schema';
import { CreatePaymentDto } from './dto/create-payment.dto';
import TypeOperation from './types/type-operation';
import { ProfilesService } from 'src/profiles/profiles.service';

//payments.repository.ts
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

  async create(
    userId: string,
    createPaymentDto: CreatePaymentDto,
  ): Promise<Payment> {
    const profile = await this.profileServise.findById(userId);
    switch (createPaymentDto.operation) {
      case TypeOperation.INCOME:
        // Логика для обработки случая "Поступление"
        profile.balance += createPaymentDto.amount;
        await profile.save();
        return await this.paymentModel.create({
          profile: userId,
          ...createPaymentDto,
        });
      // Логика для обработки случая "Списание"
      case TypeOperation.OUTGONE:
        // Если на балансе недостаточно средств, выбросить исключение
        if (
          profile.balance < createPaymentDto.amount ||
          createPaymentDto.successful === false
        ) {
          return await this.paymentModel.create({
            profile: userId,
            ...createPaymentDto,
            note: 'Недостаточно средств',
          });
        }
        profile.balance -= createPaymentDto.amount;
        await profile.save();
        return await this.paymentModel.create({
          profile: userId,
          ...createPaymentDto,
        });
      default:
        // Логика для обработки других случаев
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
