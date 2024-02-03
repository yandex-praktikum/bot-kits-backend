import { Injectable, Logger } from '@nestjs/common';
import Redis, { RedisOptions } from 'ioredis';
import { Emitter } from '@socket.io/redis-emitter'; // Emitter для публикации событий через Redis.

// redis.service.ts
@Injectable()
export class RedisService {
  public pubClient: Redis;
  public subClient: Redis;
  public emitter: Emitter;
  public taskClient: Redis;

  constructor() {
    const redisOptions: RedisOptions = { host: '127.0.0.1', port: 6379 };
    this.pubClient = new Redis(redisOptions);
    this.subClient = this.pubClient.duplicate();
    this.taskClient = this.subClient.duplicate();
    this.emitter = new Emitter(this.pubClient);

    this.initializeRedis(this.pubClient, 'Publisher');
    this.initializeRedis(this.subClient, 'Subscriber');
    this.initializeRedis(this.taskClient, 'Task');
  }

  private initializeRedis(client: Redis, clientType: string) {
    client.on('connect', () => {
      console.log(`${clientType} client connected to Redis.`);
    });

    client.on('error', (err) => {
      console.error(`${clientType} client could not connect to Redis.`, err);
    });
  }

  public publish(channel: string, message: string) {
    this.pubClient
      .publish(channel, message)
      .then(() => {
        console.log(`Message published to ${channel}`);
      })
      .catch((err) => {
        console.error(`Error publishing message to ${channel}`, err);
      });
  }

  /**
   * Отправляет сообщение в указанный канал.
   *
   * @param channel Канал для отправки, например `/chat` или `/user/${userId}`
   * @param event Событие, например 'message' или 'notify'
   * @param message Сообщение или объект, который будет отправлен.
   */
  public emit(channel: string, event: string, message: any) {
    // Пример реализации, убедитесь, что Emitter поддерживает подобные операции
    this.emitter.to(channel).emit(event, message);
    console.log(`Event ${event} emitted to ${channel}`);
  }
}
