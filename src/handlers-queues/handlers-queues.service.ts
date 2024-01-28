import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Payment } from 'src/payments/schema/payment.schema';
import TypeOperation from 'src/payments/types/type-operation';
import { Profile } from 'src/profiles/schema/profile.schema';
import { RabbitMQService } from 'src/rabbitmq/rabbitmq.service';
import {
  Subscription,
  SubscriptionDocument,
} from 'src/subscriptions/schema/subscription.schema';
import { Tariff } from 'src/tariffs/schema/tariff.schema';
import { createPaymentData, addDuration } from 'src/utils/utils';

@Injectable()
export class HandlersQueuesService implements OnModuleInit {
  private readonly subscriptionsQueue = 'subscriptionsQueue';
  private readonly anotherQueue = 'anotherQueue'; // Дополнительная очередь

  constructor(
    private readonly rabbitMQService: RabbitMQService,
    @InjectModel(Subscription.name)
    private subscriptionModel: Model<SubscriptionDocument>,
    @InjectModel(Payment.name) private paymentModel: Model<Payment>,
    @InjectModel(Tariff.name) private tariffModel: Model<Tariff>,
    @InjectModel(Profile.name) private profileModel: Model<Profile>,
  ) {}

  async onModuleInit() {
    await this.init();
  }

  private init() {
    this.rabbitMQService.consume(
      this.subscriptionsQueue,
      this.handleSubscription.bind(this),
    );

    // Подписка на другую очередь
    this.rabbitMQService.consume(
      this.anotherQueue,
      this.handleAnotherQueue.bind(this),
    );
  }

  private stringToObjectId(idString: string): Types.ObjectId {
    if (!Types.ObjectId.isValid(idString)) {
      throw new Error('Некорректный формат id');
    }
    return new Types.ObjectId(idString);
  }

  // Логика обработки подписки
  private async handleSubscription(sub) {
    const now = new Date();
    // Если время еще не наступило, снова отправляем подписку в очередь
    if (sub.debitDate > now) {
      console.log('Eщё не время списывать деньги за подписку');
      await this.rabbitMQService.publish(this.subscriptionsQueue, sub);
      return;
    }

    // Здесь может быть ваша логика обработки подписок
    if (!sub.status) {
      console.log(`У пользователя ${sub.profile._id} - нет активной подписки`);
      return;
    }

    const subscriptionId = this.stringToObjectId(sub._id);

    const subscriptionDocument = await this.subscriptionModel.findById(
      subscriptionId,
    );

    if (!subscriptionDocument) {
      console.log('Подписка не найдена');
      return;
    }

    if (sub.isCancelled) {
      console.log(`Данный пользователь ${sub.profile} - деактивировал тариф`);
      subscriptionDocument.status = false;
      subscriptionDocument.isCancelled = false;
      await subscriptionDocument.save();
      return;
    }

    // Определение текущего тарифа или обновленного тарифа
    const tariffId = sub.updatingTariff
      ? this.stringToObjectId(sub.updatingTariff.tariff._id)
      : this.stringToObjectId(sub.tariff._id);

    const currentTariff = await this.tariffModel.findOne(tariffId);

    const currentProfileId = this.stringToObjectId(sub.profile._id);

    const currentProfile = await this.profileModel.findOne(currentProfileId);

    // Проверка, является ли тариф архивным
    if (!currentTariff.status) {
      //тут будет логика если пользователь использует архвный тариф
      console.log(`Тариф ${currentTariff.name} теперь архивный`);
      return;
    }

    const paymentData = await createPaymentData(
      new Date(),
      currentTariff.price,
      sub.status,
      TypeOperation.OUTGONE,
      `Списание ежемесячного платежа по тарифу - ${currentTariff.name}`,
      currentProfile.toObject(),
      currentTariff.toObject(),
    );

    // Проверка баланса
    if (currentProfile.balance < currentTariff.price) {
      console.log(
        `У пользователя ${sub.profile} - не достаточно средств для списания по тарифу - ${currentTariff.name}`,
      );
      subscriptionDocument.status = false;
      await subscriptionDocument.save();
      await this.paymentModel.create({ ...paymentData, successful: false });
      return;
    } else {
      // Обновление подписки, если используется новый тариф
      if (sub.updatingTariff) {
        console.log('Пользователь сменил тариф на новый');
        subscriptionDocument.tariff = sub.updatingTariff;
        subscriptionDocument.updatingTariff = null; // Очистка поля обновления тарифа
        subscriptionDocument.save();
      }

      // Обработка демо-тарифа
      if (currentTariff.isDemo) {
        console.log(
          `У пользователя ${sub.profile._id} Демо тариф окончен мы его деактивируем`,
        );
        subscriptionDocument.status = false;
        await subscriptionDocument.save();
        await this.paymentModel.create({
          ...paymentData,
          successful: true,
          note: `Деактивация тарифа - ${currentTariff.name}`,
        });
        return;
      }
      console.log('Ура мы получим бабла!');
      // Списание средств
      currentProfile.balance -= currentTariff.price;
      await currentProfile.save();

      // Обновление даты следующего списания
      const nextDebitDate = await addDuration(
        sub.debitDate,
        currentTariff.duration,
      );

      subscriptionDocument.debitDate = new Date(nextDebitDate);
      await subscriptionDocument.save();

      // Запись об успешном платеже
      await this.paymentModel.create(paymentData);
    }
  }

  private handleAnotherQueue(message) {
    // Логика обработки сообщений из другой очереди
    console.log('Сообщение из другой очереди:', message);
  }
}
