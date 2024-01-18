// scheduler.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Model } from 'mongoose';
import { Payment } from 'src/payments/schema/payment.schema';
import TypeOperation from 'src/payments/types/type-operation';
import { Profile } from 'src/profiles/schema/profile.schema';
import {
  Subscription,
  SubscriptionDocument,
} from 'src/subscriptions/schema/subscription.schema';
import { Tariff } from 'src/tariffs/schema/tariff.schema';
import { addDuration, createPaymentData } from 'src/utils/utils';

@Injectable()
export class SchedulerService {
  constructor(
    @InjectModel(Subscription.name)
    private subscriptionModel: Model<SubscriptionDocument>,
    @InjectModel(Payment.name) private paymentModel: Model<Payment>,
    @InjectModel(Tariff.name) private tariffModel: Model<Tariff>,
    @InjectModel(Profile.name) private profileModel: Model<Profile>,
  ) {}

  // Функция для получения текущей даты в форматированном виде.
  private getCurrentDateFormatted(): string {
    const date = new Date();
    // Форматирование дня.
    const day = String(date.getDate()).padStart(2, '0');
    // Форматирование месяца.
    const month = String(date.getMonth() + 1).padStart(2, '0');
    // Получение года.
    const year = date.getFullYear();

    // Возвращение даты в формате дд.мм.гггг.
    return date.toISOString().split('T')[0];
  }

  @Cron('*/20 * * * * *')
  async handleSubscriptionTasks() {
    const subscriptions = await this.subscriptionModel.find({
      debitDate: this.getCurrentDateFormatted(),
    });

    subscriptions.length
      ? console.log('subscriptions имеет длину')
      : console.log('Сегодня мы не получим бабла');

    for await (const sub of subscriptions) {
      if (!sub.status) {
        console.log(`У пользователя ${sub.profile} - нет активной подписки`);
        continue;
      }

      if (sub.isCancelled) {
        console.log(`Данный пользователь ${sub.profile} - деактивировал тариф`);
        sub.status = false;
        sub.isCancelled = false;
        await sub.save();
        continue;
      }

      // Определение текущего тарифа или обновленного тарифа
      const tariffId = sub.updatingTariff ? sub.updatingTariff : sub.tariff;
      const currentTariff = await this.tariffModel.findOne(tariffId._id);
      const currentProfile = await this.profileModel.findOne(sub.profile._id);

      const paymentData = await createPaymentData(
        new Date(),
        currentTariff.price,
        sub.status,
        TypeOperation.OUTGONE,
        `Списание ежемесячного платежа по тарифу - ${currentTariff.name}`,
        sub.profile._id,
      );

      // Проверка баланса
      if (currentProfile.balance < currentTariff.price) {
        console.log(
          `У пользователя ${sub.profile} - не достаточно средств для списания по тарифу - ${currentTariff.name}`,
        );
        sub.status = false;
        await sub.save();
        await this.paymentModel.create({ ...paymentData, successful: false });
        continue;
      } else {
        // Обновление подписки, если используется новый тариф
        if (sub.updatingTariff) {
          console.log('Пользователь сменил тариф на новый');
          sub.tariff = sub.updatingTariff;
          sub.updatingTariff = null; // Очистка поля обновления тарифа
        }

        // Обработка демо-тарифа
        if (currentTariff.name === 'Демо') {
          console.log(
            `У пользователя ${sub.profile} Демо тариф окончен мы его деактивируем`,
          );
          sub.status = false;
          await sub.save();
          await this.paymentModel.create({
            ...paymentData,
            status: true,
            note: `Деактивация тарифа - ${currentTariff.name}`,
          });
          continue;
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

        sub.debitDate = new Date(nextDebitDate);
        await sub.save();

        // Запись об успешном платеже
        await this.paymentModel.create(paymentData);
      }
    }
  }

  // Задача для модуля рассылок
  @Cron(CronExpression.EVERY_HOUR)
  handleMailingTasks() {
    // Логика обработки рассылок
  }
}
