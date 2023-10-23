import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { NestGateway } from '@nestjs/websockets/interfaces/nest-gateway.interface';
import { ChatsService } from '../chats.service';
import { Bind } from '@nestjs/common';
import { Chat } from '../schema/chat.schema';
import { Server } from 'socket.io';

@WebSocketGateway({ port: 3001 })
export class ChatGateway implements NestGateway {
  @WebSocketServer() server;
  constructor(private chatServise: ChatsService) {}

  afterInit(server: Server) {
    //console.log('Init', server);
  }

  handleConnection(socket: any) {
    //console.log('Connect', socket);
    process.nextTick(async () => {
      const allChats = await this.chatServise.findAll();
      socket.emit('allChats', allChats);
    });
  }

  handleDisconnect(socket: any) {
    console.log('Disconnect', socket);
  }

  @Bind(MessageBody(), ConnectedSocket())
  @SubscribeMessage('chat')
  handleMessage(chat: Chat, sender: any) {
    console.log('New Chat', chat);
    this.chatServise.create(chat);
    sender.emit('newChat', chat);
    sender.broadcast.emit('newChat', chat);
  }
}
