// rabbitmq.service.ts
import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import * as amqp from 'amqplib';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RabbitMQService implements OnModuleInit, OnModuleDestroy {
  private connection: amqp.Connection;
  private channel: amqp.Channel;

  constructor(private readonly configService: ConfigService) {}

  async onModuleInit() {
    await this.connect();
  }

  async onModuleDestroy() {
    await this.closeConnection();
  }

  private async closeConnection() {
    if (this.channel) {
      await this.channel.close();
    }

    if (this.connection) {
      await this.connection.close();
    }
  }

  async consume(queue: string, callback: (message: any) => void) {
    await this.channel.assertQueue(queue, { durable: false });

    this.channel.consume(
      queue,
      (msg) => {
        if (msg) {
          const content = JSON.parse(msg.content.toString());
          callback(content);
          this.channel.ack(msg);
        }
      },
      { noAck: false },
    );
  }

  private async connect() {
    try {
      const rabbitMQUrl = this.configService.get<string>('RABBITMQ_URL');
      // Здесь указывайте ваш URL подключения к RabbitMQ
      this.connection = await amqp.connect(rabbitMQUrl);

      this.connection.on('error', (err) => {
        console.error('Ошибка подключения к RabbitMQ:', err);
        // Здесь можно добавить логику переподключения при необходимости
      });

      this.channel = await this.connection.createChannel();

      this.channel.on('error', (err) => {
        console.error('Ошибка канала RabbitMQ:', err);
        // Здесь можно добавить логику пересоздания канала при необходимости
      });

      console.log('Успешное подключение к RabbitMQ');
    } catch (err) {
      console.error('Не удалось подключиться к RabbitMQ:', err);
      // Здесь можно добавить логику повторного подключения или обработки ошибки
    }
  }

  async publish(queue: string, message: any) {
    const buffer = Buffer.from(JSON.stringify(message));
    await this.channel.assertQueue(queue, { durable: false });
    this.channel.sendToQueue(queue, buffer);
  }
}
