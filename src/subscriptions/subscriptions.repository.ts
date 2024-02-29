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

  private async processPayment(tariff: Tariff, profile: Profile) {
    // Здесь можно добавить логику для имитации разных сценариев оплаты
    return await createPaymentData(
      new Date(),
      tariff.price,
      true,
      TypeOperation.OUTGONE,
      'Списание',
      profile.toObject(),
      tariff.toObject(),
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
      .findOne({ 'profile._id': profile })
      .exec();
    if (!subscription) {
      throw new NotFoundException('Не найдена подписка пользователя');
    }
    return subscription;
  }

  async subscriptionAndPayments(profile: Profile): Promise<object> {
    const subscription = await this.subscriptionModel.findOne({
      'profile._id': profile._id,
    });

    const payment = await this.paymentModel.find({
      'profile._id': profile,
    });

    const dataObject = {
      tariff: null,
      status: false,
      cardMask: '',
      debitDate: new Date(),
      balance: profile.balance,
      payments: payment,
      isCancelled: false,
    };

    if (subscription) {
      const tariff = await this.tariffModel
        .findById(subscription.tariff)
        .exec();
      dataObject.tariff = tariff;
      dataObject.status = subscription.status;
      dataObject.cardMask = subscription.cardMask;
      dataObject.debitDate = subscription.debitDate;
      dataObject.isCancelled = subscription.isCancelled;
    }
    return dataObject;
  }

  //-- Метод для активации или деактивации подписки пользователя --//
  async activateSubscription(userId: Profile, status: boolean) {
    //-- Поиск подписки пользователя по его профилю --//
    const subscription = await this.findSubscriptionByProfile(userId);
    //-- Поиск профиля пользователя --//
    const profile = await this.profileModel.findById(userId);
    //-- Поиск тарифа, на который оформлена подписка --//
    const tariff = await this.tariffModel.findById(subscription.tariff);

    //-- Если подписка не найдена, выбрасывается исключение --//
    if (!subscription) {
      throw new NotFoundException('Не найдена подписка пользователя');
    }

    //-- Проверка на деактивацию подписки --//
    if (!status) {
      //-- Если баланс профиля меньше стоимости тарифа или тариф является демо, выбрасывается исключение --//
      if (profile.balance < tariff.price || tariff.isDemo) {
        throw new BadRequestException(
          'Нельзя активировать Демо тариф или недостаточно средств',
        );
      }
      //-- Обновление статуса подписки на противоположный и установка флага отмены подписки --//
      subscription.status = !status;
      subscription.isCancelled = status;
    }

    //-- Установка флага отмены подписки в зависимости от переданного статуса --//
    subscription.isCancelled = status;
    //-- Сохранение обновленной подписки --//
    return await subscription.save();
  }

  //-- Метод для создания или обновления подписки пользователя на тариф --//
  async create(
    createSubscriptionDto: CreateSubscriptionDto, //-- DTO с данными для создания подписки --//
    tariffId: string, //-- ID тарифа, на который подписывается пользователь --//
    user: Profile, //-- Профиль пользователя, подписывающегося на тариф --//
  ): Promise<Subscription> {
    //-- Поиск существующей подписки пользователя --//
    const subscription = await this.subscriptionModel
      .findOne({ 'profile._id': user._id })
      .exec();

    //-- Поиск тарифа по ID --//
    const tariff = await this.tariffModel.findById(tariffId).exec();

    //-- Проверка существования тарифа и что это не демо-тариф --//
    if (!tariff || tariff.isDemo) {
      throw new NotFoundException('Неверный идентификатор тарифа');
    }

    const profile = await this.profileModel.findById(user._id);

    //-- Обработка оплаты тарифа --//
    const paymentSuccess = await this.processPayment(tariff, profile);

    //-- Проверка успешности оплаты --//
    if (!paymentSuccess.successful) {
      throw new BadRequestException('Ошибка оплаты');
    }

    //-- Проверка наличия активной подписки у пользователя --//
    if (subscription && subscription.status) {
      console.log('Пользователь сменил тариф при имеющимся активном тарифе');
      //-- Обновление существующей подписки, если пользователь выбрал новый тариф --//
      return await this.subscriptionModel
        .findByIdAndUpdate(
          subscription._id, //-- ID подписки для обновления --//
          {
            updatingTariff: tariff, //-- Новый тариф, на который меняется подписка --//
            status: true, //-- Статус подписки активен --//
            isCancelled: false, //-- Подписка не отменена --//
          },
          { new: true }, //-- Возвращать обновленный документ --//
        )
        .exec();
    } else {
      console.log(`Пользователь активировал тариф - ${tariff.name}`);
      //-- Создание новой подписки или обновление деактивированной подписки --//
      return await this.subscriptionModel
        .findByIdAndUpdate(
          subscription ? subscription._id : undefined, //-- ID подписки для обновления, если она существует --//
          {
            ...createSubscriptionDto, //-- Данные для создания/обновления подписки --//
            tariff: tariff.toObject(), //-- Данные тарифа --//
            status: true, //-- Статус подписки активен --//
            profile: profile.toObject(), //-- Профиль пользователя --//
            isCancelled: false, //-- Подписка не отменена --//
          },
          { new: true }, //-- Возвращать обновленный документ --//
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
