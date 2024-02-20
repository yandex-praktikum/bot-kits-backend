import { Injectable } from '@nestjs/common';
import Redis, { RedisOptions } from 'ioredis';
import { Emitter } from '@socket.io/redis-emitter'; // Emitter для публикации событий через Redis.
import { ConfigService } from '@nestjs/config';

//-- Инъекция зависимостей для сервиса работы с Redis --//
@Injectable()
export class RedisService {
  //-- Хранение экземпляров клиентов Redis, ключ - имя клиента, значение - сам клиент --//
  private clients: Map<string, Redis> = new Map();

  //-- Эмиттер для публикации событий --//
  public emitter: Emitter;

  constructor(private readonly configService: ConfigService) {
    //-- Опции для подключения к Redis --//
    const redisOptions: RedisOptions = {
      host: configService.get<string>('REDIS_HOST'),
      port: +configService.get<string>('REDIS_PORT'),
    };

    //-- Создание клиента для публикации сообщений с использованием заданных опций --//
    this.createClient('pubClient', redisOptions);

    //-- Инициализация эмиттера, связанного с клиентом для публикаций --//
    this.emitter = new Emitter(this.getClient('pubClient'));
  }

  //-- Создание нового клиента Redis или дубликат существующего --//
  public createClient(
    name: string, // Имя для нового клиента
    options: RedisOptions, // Опции подключения
    //-- По умолчанию не создаем дубликат --//
    // eslint-disable-next-line @typescript-eslint/no-inferrable-types
    duplicate: boolean = false,
  ) {
    //-- Создание дубликата или нового экземпляра клиента в зависимости от флага --//
    const client = duplicate
      ? this.clients.get('pubClient')?.duplicate()
      : new Redis(options);

    if (client) {
      //-- Инициализация событий подключения и ошибок для клиента --//
      this.initializeRedis(client, name);
      //-- Сохранение клиента в коллекцию --//
      this.clients.set(name, client);
    }
  }

  //-- Получение экземпляра клиента по имени --//
  public getClient(name: string): Redis | undefined {
    return this.clients.get(name);
  }

  //-- Инициализация обработчиков событий для клиента Redis --//
  private initializeRedis(client: Redis, clientType: string) {
    //-- Событие успешного подключения к Redis --//
    client.on('connect', () => {
      console.log(`${clientType} client connected to Redis.`);
    });
    //-- Обработка ошибок подключения --//
    client.on('error', (err) => {
      console.error(`${clientType} client could not connect to Redis.`, err);
    });
  }

  //-- Публикация сообщения в канал --//
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

  //-- Генерация события в канал --//
  public async emit(channel: string, event: string, message: any) {
    this.emitter.to(channel).emit(event, message);
    console.log(`Event ${event} emitted to ${channel}`);
  }
}
