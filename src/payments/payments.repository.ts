import { Injectable, UsePipes, ValidationPipe } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Payment, PaymentDocument } from './schema/payment.schema';
import { Model } from 'mongoose';
import { Profile } from '../profiles/schema/profile.schema';
import { CreatePaymentDto } from './dto/create-payment.dto';

//payments.repository.ts
export abstract class RepositoryPort {
  abstract create(data: CreatePaymentDto): Promise<Payment>;
  abstract delete(data: string): Promise<Payment>;
  abstract findOne(data: string): Promise<Payment>;
  abstract findAll(): Promise<Payment[]>;
  abstract findUsersAll(data: Profile): Promise<Payment[]>;
  abstract update(id: string, data: CreatePaymentDto): Promise<Payment>;
}

@Injectable()
export class PaymentsRepository extends RepositoryPort {
  constructor(
    @InjectModel(Payment.name)
    private paymentModel: Model<PaymentDocument>,
  ) {
    super();
  }
  async create(createPaymentDto: CreatePaymentDto): Promise<Payment> {
    return await this.paymentModel.create(createPaymentDto);
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

  async findUsersAll(profile: Profile): Promise<Payment[]> {
    return await this.paymentModel.find({ profile }).exec();
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
