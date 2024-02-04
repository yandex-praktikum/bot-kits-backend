import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ChatsService } from './chats.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import Redis from 'ioredis';
import { Emitter } from '@socket.io/redis-emitter';
import { RedisService } from 'src/redis/redis.service';

@Controller('chats')
export class ChatsController {
  private pubClient: Redis;
  private subClient: Redis;
  private taskClient: Redis;
  private emitter: Emitter;

  constructor(
    private readonly chatsService: ChatsService,
    private redisService: RedisService,
  ) {
    const { pubClient, subClient, emitter, taskClient } = this.redisService;
    this.pubClient = pubClient;
    this.subClient = subClient;
    this.taskClient = taskClient;
    this.emitter = emitter;
  }

  @Post('/task')
  create(@Body() createChatDto: CreateChatDto) {
    this.taskClient.publish('task', JSON.stringify(req.body)); // Публикация задачи в Redis.
    //res.json({ result: 'OK' }); // Отправка ответа клиенту.
    return this.chatsService.create(createChatDto);
  }

  @Get()
  findAll() {
    return this.chatsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.chatsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateChatDto: UpdateChatDto) {
    return this.chatsService.update(+id, updateChatDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.chatsService.remove(+id);
  }
}
