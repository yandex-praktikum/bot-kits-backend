import { Injectable } from '@nestjs/common';
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
    return await this.paymentModel.create({
      ...createPaymentDto,
    });
  }

  async delete(id: number) {
    return await this.paymentModel.findByIdAndRemove(id).exec();
  }

  async findOne(id: number): Promise<Payment> {
    return this.paymentModel.findById(id).exec();
  }

  async findAll(): Promise<Payment[]> {
    return await this.paymentModel.find().exec();
  }

  async findUsersAll(profile: Profile): Promise<Payment[]> {
    return await this.paymentModel.find({ profile }).exec();
  }
}
