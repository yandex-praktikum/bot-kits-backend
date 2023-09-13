import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  Subscription,
  SubscriptionDocument,
} from './schema/subscription.schema';
import { Model } from 'mongoose';
import { Profile } from '../profiles/schema/profile.schema';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { Payment } from '../payments/schema/payment.schema';

@Injectable()
export class SubscriptionsService {
  constructor(
    @InjectModel(Subscription.name)
    private subscriptionModel: Model<SubscriptionDocument>,
    @InjectModel(Payment.name) private paymentModel: Model<Payment>,
  ) {}

  async subscriptionAndPayments(profile: Profile): Promise<object> {
    //Promise<object> {
    const subscription = await this.subscriptionModel.findOne({ profile });
    const payment = await this.paymentModel.find({ profile });
    let tariff = '';
    if (subscription) {
      tariff = 'Бизнес'; //await this.tariffModel.findById({ subscription.tariffId });
    }
    return {
      tariff,
      status: subscription.status,
      cardMask: subscription.cardMask,
      debitDate: subscription.debitDate,
      balance: profile.balance,
      payments: payment,
    };
  }

  async activateSubscription(profile: Profile) {
    console.log(profile);
    console.log(profile.id);
    const subscription = await this.subscriptionModel
      .findOne({ profile: profile })
      .exec();
    if (!subscription) {
      throw new NotFoundException('Не найдена подписка пользователя');
    }
    subscription.status = true;
    await subscription.save();
    return subscription;
  }

  async create(
    createSubscriptionDto: CreateSubscriptionDto,
  ): Promise<Subscription> {
    const subscription = await this.subscriptionModel
      .findOne({ profile: createSubscriptionDto.profile })
      .exec();
    if (subscription) {
      this.delete(subscription.id);
    }
    return await this.subscriptionModel.create({
      ...createSubscriptionDto,
      status: true,
    });
  }

  async delete(id: number) {
    return await this.subscriptionModel.findByIdAndRemove(id).exec();
  }

  async findOne(id: number): Promise<Subscription> {
    return this.subscriptionModel.findById(id).exec();
  }

  async findAll(): Promise<Subscription[]> {
    return await this.subscriptionModel.find().exec();
  }
}
