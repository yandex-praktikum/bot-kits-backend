import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Payment, PaymentDocument } from './schema/payment.schema';
import { Model } from 'mongoose';
import { Profile } from '../profiles/schema/profile.schema';
import { CreatePaymentDto } from './dto/create-payment.dto';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectModel(Payment.name)
    private paymentModel: Model<PaymentDocument>,
  ) {}

  async create(createPaymentDto: CreatePaymentDto): Promise<Payment> {
    return await this.paymentModel.create(createPaymentDto);
  }

  async delete(id: string) {
    //Не проверяем принадлежность операции пользователю, поскольку метод для администрирования, а не фронта
    let deletedPayment;
    try {
      deletedPayment = await this.paymentModel.findByIdAndRemove(id).exec();
    } catch {
      throw new BadRequestException('не валидный id');
    }
    if (!deletedPayment) {
      throw new NotFoundException('платеж не найден');
    }
    return deletedPayment;
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
    const updatedPayment = await this.paymentModel.findByIdAndUpdate(
      id,
      updatePaymentDto,
      {
        new: true,
        runValidators: true,
      },
    );
    if (!updatedPayment) {
      throw new NotFoundException('платеж не найден');
    }
    return updatedPayment;
  }
}
