// ws.gateway.ts
import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { createAdapter } from 'socket.io-redis';
import Redis from 'ioredis';
import {
  OnModuleInit,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Chat, ChatDocument } from '../schema/chat.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { WSGuard } from 'src/auth/guards/ws.guards';

//chats.gateway.ts
@UseGuards(WSGuard)
@WebSocketGateway()
export class WsGateway implements OnModuleInit {
  @WebSocketServer()
  server: Server;
  private redisClient: Redis;

  constructor(@InjectModel(Chat.name) private chatModel: Model<ChatDocument>) {
    this.redisClient = new Redis({ host: '127.0.0.1', port: 3003 });
  }

  async onModuleInit() {
    const subClient = this.redisClient.duplicate();
    this.server.adapter(
      createAdapter({ pubClient: this.redisClient, subClient }),
    );
  }

  async handleConnection(client: Socket) {
    if (!client.handshake.headers.authorization) {
      client.disconnect();
      client.emit('error', 'Пользователь не авторизован');
    }
    const user = client.data.user;
    if (!user) return;

    const cacheKey = `chat_history_${user.id}`;
    let chats = await this.redisClient.get(cacheKey);

    if (!chats) {
      const chatDocuments = await this.chatModel
        .find({
          $or: [{ sender: user.id }, { recipient: user.id }],
        })
        .exec();

      // Сериализация результатов запроса в строку
      chats = JSON.stringify(chatDocuments);
      await this.redisClient.set(cacheKey, chats);
    } else {
      chats = JSON.parse(chats);
    }

    client.emit('chatHistory', chats);
  }

  @UsePipes(new ValidationPipe())
  @SubscribeMessage('sendMessage')
  async handleMessage(
    client: Socket,
    payload: { recipient: string; message: string; roomId: string },
  ): Promise<void> {
    const sender = client.data.user.id;
    const newChat = new this.chatModel({
      message: payload.message,
      sender: sender,
      recipient: payload.recipient,
      roomId: payload.roomId, // определить логику для roomId
      profile: sender,
    });

    await newChat.save();

    // Обновляем кеш
    const cacheKey = `chat_history_${sender}`;
    const cachedChats = await this.redisClient.get(cacheKey);
    const chats = cachedChats ? JSON.parse(cachedChats) : [];
    chats.push(newChat);
    await this.redisClient.set(cacheKey, JSON.stringify(chats));

    // Отправляем сообщение получателю
    this.server.to(payload.recipient).emit('newMessage', JSON.stringify(chats));
  }

  @SubscribeMessage('joinRoom')
  handleJoinRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() roomId: string,
  ) {
    client.join(roomId);
    // Опционально: отправить историю сообщений или уведомление о новом пользователе в комнате
  }
}
