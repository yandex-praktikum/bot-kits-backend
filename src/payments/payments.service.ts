import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Payment } from './schema/payment.schema';
import { Profile } from '../profiles/schema/profile.schema';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { RepositoryPort } from './payments.repository';

//payments.service.ts
@Injectable()
export class PaymentsService {
  constructor(private readonly paymentsRepository: RepositoryPort) {}

  async create(createPaymentDto: CreatePaymentDto) {
    try {
      return await this.paymentsRepository.create(createPaymentDto);
    } catch (error: unknown) {
      throw error;
    }
  }

  async delete(id: string) {
    let deletedPayment: Payment;
    try {
      deletedPayment = await this.paymentsRepository.delete(id);
    } catch {
      throw new BadRequestException('не валидный id');
    }
    if (!deletedPayment) {
      throw new NotFoundException('платеж не найден');
    }
    return deletedPayment;
  }

  async findOne(id: string) {
    return this.paymentsRepository.findOne(id);
  }

  async findAll() {
    return this.paymentsRepository.findAll();
  }

  async findUsersAll(profile: Profile) {
    return this.paymentsRepository.findUsersAll(profile);
  }

  async update(id: string, updatePaymentDto: CreatePaymentDto) {
    let updatedPayment: Payment;
    try {
      updatedPayment = await this.paymentsRepository.update(
        id,
        updatePaymentDto,
      );
    } catch {
      throw new BadRequestException('не валидный id');
    }
    if (!updatedPayment) {
      throw new NotFoundException('платеж не найден');
    }
    return updatedPayment;
  }
}
