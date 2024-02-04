import { Injectable, Logger } from '@nestjs/common';
import Redis, { RedisOptions } from 'ioredis';
import { Emitter } from '@socket.io/redis-emitter'; // Emitter для публикации событий через Redis.

@Injectable()
export class RedisService {
  private clients: Map<string, Redis> = new Map();
  public emitter: Emitter;

  constructor() {
    const redisOptions: RedisOptions = { host: '127.0.0.1', port: 6379 };
    // Инициализация основных клиентов
    this.createClient('pubClient', redisOptions);
    // Создание эмиттера
    this.emitter = new Emitter(this.getClient('pubClient'));
  }

  public createClient(
    name: string,
    options: RedisOptions,
    // eslint-disable-next-line @typescript-eslint/no-inferrable-types
    duplicate: boolean = false,
  ) {
    const client = duplicate
      ? this.clients.get('pubClient')?.duplicate()
      : new Redis(options);
    if (client) {
      this.initializeRedis(client, name);
      this.clients.set(name, client);
    }
  }

  public getClient(name: string): Redis | undefined {
    return this.clients.get(name);
  }

  private initializeRedis(client: Redis, clientType: string) {
    client.on('connect', () => {
      console.log(`${clientType} client connected to Redis.`);
    });
    client.on('error', (err) => {
      console.error(`${clientType} client could not connect to Redis.`, err);
    });
  }

  public async publish(channel: string, message: string) {
    this.getClient('pubClient')
      ?.publish(channel, message)
      .then(() => {
        console.log(`Message published to ${channel}`);
      })
      .catch((err) => {
        console.error(`Error publishing message to ${channel}`, err);
      });
  }

  public async emit(channel: string, event: string, message: any) {
    this.emitter.to(channel).emit(event, message);
    console.log(`Event ${event} emitted to ${channel}`);
  }

  // Дополнительные методы...
}
