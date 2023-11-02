import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  Subscription,
  SubscriptionDocument,
} from './schema/subscription.schema';
import { Model } from 'mongoose';
import { Profile } from '../profiles/schema/profile.schema';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { Payment } from '../payments/schema/payment.schema';
import { Tariff } from 'src/tariffs/schema/tariff.schema';

@Injectable()
export class SubscriptionsRepository {
  constructor(
    @InjectModel(Subscription.name)
    private subscriptionModel: Model<SubscriptionDocument>,
    @InjectModel(Payment.name) private paymentModel: Model<Payment>,
    @InjectModel(Tariff.name) private tariffModel: Model<Tariff>,
  ) {}

  async findOne(id: number): Promise<Subscription> {
    return this.subscriptionModel.findById(id).exec();
  }

  async findAll(): Promise<Subscription[]> {
    return await this.subscriptionModel.find().exec();
  }

  async findSubscriptionByProfile(profile: Profile) {
    const subscription = await this.subscriptionModel
      .findOne({ profile: profile })
      .exec();
    if (!subscription) {
      throw new NotFoundException('Не найдена подписка пользователя');
    }
    return subscription;
  }

  async subscriptionAndPayments(profile: Profile): Promise<object> {
    const subscription = await this.subscriptionModel.findOne({ profile });
    const payment = await this.paymentModel.find({ profile });
    const dataObject = {
      tariff: '',
      status: false,
      cardMask: '',
      debitDate: new Date(),
      balance: profile.balance,
      payments: payment,
    };
    if (subscription) {
      const tariff = await this.tariffModel
        .findById(subscription.tariff)
        .exec();
      dataObject.tariff = tariff.name;
      dataObject.status = subscription.status;
      dataObject.cardMask = subscription.cardMask;
      dataObject.debitDate = subscription.debitDate;
    }
    return dataObject;
  }

  async activateSubscription(profile: Profile, status: boolean) {
    const subscription = await this.findSubscriptionByProfile(profile);
    if (!subscription) {
      throw new NotFoundException('Не найдена подписка пользователя');
    }
    subscription.status = status;
    return await subscription.save();
  }

  async create(
    createSubscriptionDto: CreateSubscriptionDto,
    tariffId: string,
    userId: string,
  ): Promise<Subscription> {
    const subscription = await this.subscriptionModel
      .findOne({ profile: userId })
      .exec();

    const tariff = await this.tariffModel.findById(tariffId).exec();
    if (!tariff) {
      throw new NotFoundException('Неверный идентификатор тарифа');
    }
    if (subscription) {
      throw new BadRequestException('Подписка уже существует');
    }
    return await this.subscriptionModel.create({
      ...createSubscriptionDto,
      tariff: tariffId,
      status: true,
      profile: userId,
    });
  }

  async delete(id: number) {
    return await this.subscriptionModel.findByIdAndRemove(id).exec();
  }
}
