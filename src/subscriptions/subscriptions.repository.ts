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
import mongoose, { Model } from 'mongoose';
import { Profile } from '../profiles/schema/profile.schema';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { Payment } from '../payments/schema/payment.schema';
import { Tariff } from 'src/tariffs/schema/tariff.schema';
import { createPaymentData } from 'src/utils/utils';
import TypeOperation from 'src/payments/types/type-operation';

@Injectable()
export class SubscriptionsRepository {
  constructor(
    @InjectModel(Subscription.name)
    private subscriptionModel: Model<SubscriptionDocument>,
    @InjectModel(Payment.name) private paymentModel: Model<Payment>,
    @InjectModel(Tariff.name) private tariffModel: Model<Tariff>,
    @InjectModel(Profile.name) private profileModel: Model<Profile>,
  ) {}

  private async processPayment(tariff: Tariff, subscription: Subscription) {
    // Здесь можно добавить логику для имитации разных сценариев оплаты
    return await createPaymentData(
      new Date(),
      tariff.price,
      true,
      TypeOperation.OUTGONE,
      'Списание',
      subscription.profile,
    );
  }

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

  async activateSubscription(userId: Profile, status: boolean) {
    const subscription = await this.findSubscriptionByProfile(userId);
    const profile = await this.profileModel.findById(userId);
    const tariff = await this.tariffModel.findById(subscription.tariff);

    if (!subscription) {
      throw new NotFoundException('Не найдена подписка пользователя');
    }
    //Когда приостанавливается тариф status === true
    if (!status) {
      if (profile.balance < tariff.price || tariff.name === 'Демо') {
        throw new BadRequestException(
          'Нельзя активировать Демо тариф или недостаточно средств',
        );
      }
      subscription.status = !status;
      subscription.isCancelled = status;
    }

    subscription.isCancelled = status;
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

    console.log(tariff.name);

    if (!tariff || tariff.name === 'Демо') {
      throw new NotFoundException('Неверный идентификатор тарифа');
    }

    // Обработка оплаты
    const paymentSuccess = await this.processPayment(tariff, subscription);

    if (!paymentSuccess.successful) {
      throw new BadRequestException('Ошибка оплаты');
    }

    // Создание или обновление подписки
    if (subscription && subscription.status) {
      console.log('Пользователь сменил тариф при имеющимся активном тарифе');
      // Обновление существующей подписки если пользователь выбрал новый тариф
      return await this.subscriptionModel
        .findByIdAndUpdate(
          subscription._id,
          {
            updatingTariff: tariff._id,
            status: true,
            isCancelled: false,
          },
          { new: true },
        )
        .exec();
    } else {
      console.log('Пользователь активировал тариф');
      // если у пользователя была деактивирована подписка, обновляем статус и дату следующего списания
      return await this.subscriptionModel
        .findByIdAndUpdate(
          subscription._id,
          {
            ...createSubscriptionDto,
            tariff: tariffId,
            status: true,
            profile: userId,
            isCancelled: false,
          },
          { new: true },
        )
        .exec();
    }
  }

  async initSubscription(
    subscriptioData,
    session?: mongoose.ClientSession,
  ): Promise<Subscription> {
    const subscriptionNew = new this.subscriptionModel(subscriptioData);
    if (session) {
      return await subscriptionNew.save({ session: session });
    }
    return await subscriptionNew.save();
  }

  async delete(id: number) {
    return await this.subscriptionModel.findByIdAndRemove(id).exec();
  }
}
