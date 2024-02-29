import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import * as amqp from 'amqplib';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RabbitMQService implements OnModuleInit, OnModuleDestroy {
  private connection: amqp.Connection; //-- Хранение объекта подключения к RabbitMQ --//
  private channel: amqp.Channel; //-- Хранение канала для взаимодействия с RabbitMQ --//

  //-- Внедрение сервиса конфигурации для доступа к переменным окружения и конфигам --//
  constructor(private readonly configService: ConfigService) {}

  //-- Метод, вызываемый при инициализации модуля, устанавливает подключение к RabbitMQ --//
  async onModuleInit() {
    await this.connect();
  }

  //-- Метод, вызываемый при уничтожении модуля, закрывает подключение к RabbitMQ --//
  async onModuleDestroy() {
    await this.closeConnection();
  }

  //-- Закрытие канала и соединения с RabbitMQ --//
  private async closeConnection() {
    if (this.channel) {
      await this.channel.close(); //-- Закрытие канала --//
    }

    if (this.connection) {
      await this.connection.close(); //-- Закрытие соединения --//
    }
  }

  //-- Метод для подписки на сообщения из указанной очереди --//
  async consume(queue: string, callback: (message: any) => void) {
    //-- Убеждаемся, что очередь существует --//
    await this.channel.assertQueue(queue, { durable: false });

    //-- Подписка на сообщения из очереди и их обработка --//
    this.channel.consume(
      queue,
      (msg) => {
        if (msg) {
          const content = JSON.parse(msg.content.toString()); //-- Разбор полученного сообщения --//
          callback(content); //-- Вызов callback-функции для обработки сообщения --//
          this.channel.ack(msg); //-- Подтверждение обработки сообщения --//
        }
      },
      { noAck: false },
    );
  }

  //-- Установление соединения с RabbitMQ --//
  private async connect() {
    try {
      //-- Получение URL подключения из конфигурации --//
      const rabbitMQUrl = this.configService.get<string>('RABBITMQ_URL');

      //-- Подключение к RabbitMQ --//
      this.connection = await amqp.connect(rabbitMQUrl);

      //-- Обработка ошибок соединения --//
      this.connection.on('error', (err) => {
        console.error('Ошибка подключения к RabbitMQ:', err);
      });

      //-- Создание канала для взаимодействия --//
      this.channel = await this.connection.createChannel();

      //-- Обработка ошибок канала --//
      this.channel.on('error', (err) => {
        console.error('Ошибка канала RabbitMQ:', err);
      });

      console.log('Успешное подключение к RabbitMQ');
    } catch (err) {
      console.error('Не удалось подключиться к RabbitMQ:', err);
    }
  }

  //-- Метод для публикации сообщений в указанную очередь --//
  async publish(queue: string, message: any) {
    const buffer = Buffer.from(JSON.stringify(message)); //-- Преобразование сообщения в буфер --//
    //-- Убеждаемся, что очередь существует --//
    await this.channel.assertQueue(queue, { durable: false });
    //-- Отправка сообщения в очередь --//
    this.channel.sendToQueue(queue, buffer);
  }
}
