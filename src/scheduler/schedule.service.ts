import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Model } from 'mongoose';
import { MailingService } from 'src/mailing/mailing.service';
import { Payment } from 'src/payments/schema/payment.schema';
import { Profile } from 'src/profiles/schema/profile.schema';
import { RabbitMQService } from 'src/rabbitmq/rabbitmq.service';
import {
  Subscription,
  SubscriptionDocument,
} from 'src/subscriptions/schema/subscription.schema';
import { Tariff } from 'src/tariffs/schema/tariff.schema';
import { startOfDay, endOfDay } from 'date-fns';

//-- Сервис для выполнения запланированных задач --//
@Injectable()
export class SchedulerService {
  private readonly subscriptionsQueue = 'subscriptionsQueue'; //-- Имя очереди для задач по подписке --//

  constructor(
    //-- Внедрение зависимостей моделей и сервисов --//
    @InjectModel(Subscription.name)
    private subscriptionModel: Model<SubscriptionDocument>,
    private mailingService: MailingService,
    @InjectModel(Payment.name) private paymentModel: Model<Payment>,
    @InjectModel(Tariff.name) private tariffModel: Model<Tariff>,
    @InjectModel(Profile.name) private profileModel: Model<Profile>,
    private readonly rabbitMQService: RabbitMQService, //-- Сервис для работы с RabbitMQ --//
  ) {}

  //-- Задача для обработки подписок, выполняется каждые 20 секунд --//
  //-- 0 0 0 * * * - в 00:00:00 каждый день для прода --//
  @Cron('*/20 * * * * *', {
    timeZone: 'UTC',
  })
  async handleSubscriptionTasks() {
    //-- Определение начала и конца текущего дня --//
    const today = new Date();
    const startOfToday = startOfDay(today);
    const endOfToday = endOfDay(today);

    //-- Поиск подписок, которые требуют списания сегодня --//
    const subscriptions = await this.subscriptionModel.find({
      debitDate: {
        $gte: startOfToday,
        $lte: endOfToday,
      },
    });

    //-- Логирование количества списаний на сегодня --//
    subscriptions.length
      ? console.log('Сегодня планируются списания у пользователей')
      : console.log('Сегодня списаний у пользователей не планируется');

    //-- Публикация задач по списаниям в очередь RabbitMQ --//
    for await (const sub of subscriptions) {
      await this.rabbitMQService.publish(this.subscriptionsQueue, sub);
    }
  }

  //-- Задача для выполнения рассылок --//
  @Cron(CronExpression.EVERY_5_SECONDS)
  async handleMailingTasks() {
    //-- Получение активных постов для рассылки --//
    const activePosts = await this.mailingService.findAllActive();
    activePosts.forEach(async (post) => {
      const dateNow = new Date(Date.now());
      const postDate = post.schedule.date || dateNow;

      //-- Проверка условий для отправки поста и отправка, если условия соблюдены --//
      if (post.schedule.isNow || postDate <= dateNow) {
        console.log('Отправляем пост');
        const isOk = true; // Заглушка для логики отправки поста

        //-- Отключение поста после отправки, если не требуется повтор --//
        if (isOk && !post.schedule.isRepeat) {
          post.isActive = false;
          await post.save();
        }
      }
    });
  }

  //-- Задача для обработки архивных тарифов, выполняется каждый час --//
  @Cron(CronExpression.EVERY_HOUR)
  handleTasks() {
    //-- Здесь должна быть логика обработки архивных тарифов --//
  }
}
