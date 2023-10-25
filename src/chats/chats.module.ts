import { Module } from '@nestjs/common';
import { ChatsService } from './chats.service';
import { ChatsController } from './chats.controller';
import { Chat, ChatSchema } from './schema/chat.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatGateway } from './gateway/chats.gateway';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Chat.name, schema: ChatSchema }]),
  ],
  controllers: [ChatsController],
  providers: [ChatGateway, ChatsService],
})
export class ChatsModule {}
