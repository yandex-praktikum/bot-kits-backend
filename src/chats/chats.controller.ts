import { Controller, Get, Post, Body, NotFoundException } from '@nestjs/common';
import { ChatsService } from './chats.service';
import { CreateChatDto } from './dto/create-chat.dto';
import Redis from 'ioredis';
import { Emitter } from '@socket.io/redis-emitter';
import { RedisService } from 'src/redis/redis.service';

@Controller('chats')
export class ChatsController {
  private taskClient: Redis;
  private emitter: Emitter;

  constructor(
    private readonly chatsService: ChatsService,
    private redisService: RedisService,
  ) {
    this.redisService.createClient(
      'taskClientChatsController',
      { host: '127.0.0.1', port: 6379 },
      true,
    );
    this.taskClient = this.redisService.getClient('taskClientChatsController');

    const { emitter } = this.redisService;
    this.emitter = emitter;
  }

  @Post('/task')
  createTask(@Body() createChatDto: CreateChatDto) {
    this.taskClient.publish('task', JSON.stringify(createChatDto)); // Публикация задачи в Redis.
    return { result: 'OK' }; // Отправка ответа клиенту.
  }

  @Post('/message')
  createMessage(@Body() createChatDto: CreateChatDto) {
    this.emitter.to(`/chat`).emit('message', createChatDto); // Отправка сообщения через Redis Emitter.
    this.taskClient.publish('message', JSON.stringify(createChatDto)); // Публикация сообщения в Redis.
    return { result: 'OK' }; // Отправка ответа клиенту.
  }

  @Get('/history')
  async getHistory() {
    try {
      const history = await this.taskClient.get('history'); // Получение истории из Redis.
      return JSON.parse(history); // Разбор истории из строки в объект.
    } catch (err) {
      this.taskClient.publish('message', JSON.stringify({})); // Публикация пустого сообщения в случае ошибки.
      throw new NotFoundException('Retry-After');
    }
  }
}
