import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { NestGateway } from '@nestjs/websockets/interfaces/nest-gateway.interface';
import { ChatsService } from '../chats.service';
import { Bind, UseGuards } from '@nestjs/common';
import { Chat } from '../schema/chat.schema';
import { Server, Socket } from 'socket.io';
import { WSGuard } from 'src/auth/guards/ws.guards';

@UseGuards(WSGuard)
@WebSocketGateway({ port: 3001, namespace: '/chats' })
export class ChatGateway implements NestGateway {
  @WebSocketServer() server;
  constructor(private chatServise: ChatsService, private wsGuard: WSGuard) {}

  afterInit(server: Server) {
    console.log('Init');
  }

  handleConnection(socket: any) {
    if (!socket.handshake.headers.authorization) {
      socket.disconnect();
    }
    console.log('Connect', socket.id);
  }

  handleDisconnect(socket: any) {
    console.log('Disconnect', socket.id);
  }

  @Bind(MessageBody(), ConnectedSocket())
  @SubscribeMessage('chat')
  async createChat(chat: Chat, sender: any, client: Socket) {
    console.log('New Chat', chat);
    this.chatServise.create(chat);
    sender.emit('newChat', chat);
  }

  @SubscribeMessage('getAllChats')
  async getAllChats(client: Socket) {
    try {
      // Получаем информацию о пользователе из данных сокета
      const user = client.data.user;

      // Проверяем, существует ли информация о пользователе
      if (!user) {
        client.emit('authError', { message: 'Пользователь не найден' });
        return;
      }

      // Получаем чаты для данного пользователя
      const chats = await this.chatServise.findChatsForUser(user.id);

      if (!chats) {
        client.emit('Error', { message: 'У пользователя нет чатов' });
        return;
      }

      //Найти Уникальных Отправителей
      const uniqueSenders = Array.from(
        new Set(chats.map((chat) => chat.sender)),
      );
      //Формирование Пар для Истории Сообщений
      const chatPairs = [];

      uniqueSenders.forEach((sender) => {
        // Получаем всех уникальных получателей для каждого отправителя
        const recipients = new Set(
          chats
            .filter((chat) => chat.sender === sender)
            .map((chat) => chat.recipient),
        );

        recipients.forEach((recipient) => {
          // Добавляем пару отправитель-получатель, если она ещё не была добавлена
          if (
            !chatPairs.some(
              (pair) => pair.includes(sender) && pair.includes(recipient),
            )
          ) {
            chatPairs.push([sender, recipient]);
          }
        });
      });
      for (const pair of chatPairs) {
        const chatHistory = await this.chatServise.findChatHistory(
          pair[0],
          pair[1],
        );
        // Отправляем чаты клиенту
        client.emit('chatsList', chatHistory);
      }
    } catch (error) {
      console.error('Ошибка при получении чатов:', error);
      client.emit('error', { message: 'Ошибка при получении чатов' });
    }
  }
}
