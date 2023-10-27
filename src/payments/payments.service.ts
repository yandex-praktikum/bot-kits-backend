import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Payment } from './schema/payment.schema';
import { Profile } from '../profiles/schema/profile.schema';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { PaymentsRepository } from './payments.repository';

@Injectable()
export class PaymentsService {
  constructor(private readonly dbQuery: PaymentsRepository) {}

  async create(createPaymentDto: CreatePaymentDto) {
    return this.dbQuery.create(createPaymentDto);
  }

  async delete(id: string) {
    let deletedPayment: Payment;
    try {
      deletedPayment = await this.dbQuery.delete(id);
    } catch {
      throw new BadRequestException('не валидный id');
    }
    if (!deletedPayment) {
      throw new NotFoundException('платеж не найден');
    }
    return deletedPayment;
  }

  async findOne(id: string) {
    return this.dbQuery.findOne(id);
  }

  async findAll() {
    return this.dbQuery.findAll();
  }

  async findUsersAll(profile: Profile) {
    return this.dbQuery.findUsersAll(profile);
  }

  async update(id: string, updatePaymentDto: CreatePaymentDto) {
    let updatedPayment: Payment;
    try {
      updatedPayment = await this.dbQuery.update(id, updatePaymentDto);
    } catch {
      throw new BadRequestException('не валидный id');
    }
    if (!updatedPayment) {
      throw new NotFoundException('платеж не найден');
    }
    return updatedPayment;
  }
}
