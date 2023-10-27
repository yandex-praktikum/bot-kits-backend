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
import { Server } from 'socket.io';
import { JwtGuard } from 'src/auth/guards/jwtAuth.guards';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Profile } from 'src/profiles/schema/profile.schema';
import { AuthUser } from 'src/auth/decorators/auth-user.decorator';
import { RolesGuard } from 'src/auth/guards/role.guard';

@WebSocketGateway({ port: 3001, namespace: '/chats' })
export class ChatGateway implements NestGateway {
  @WebSocketServer() server;
  constructor(private chatServise: ChatsService) {}

  afterInit(server: Server) {
    //console.log('Init', server);
  }

  handleConnection(socket: any) {
    if (!socket.handshake.headers.authorization) {
      socket.disconnect();
    }
    try {
      console.log('Connect');
      process.nextTick(async () => {
        const allChats = await this.chatServise.findAll();
        socket.emit('allChats', allChats);
      });
    } catch (error) {
      socket.disconnect();
    }
  }

  handleDisconnect(socket: any) {
    console.log('Disconnect');
  }
  @UseGuards(JwtGuard)
  //@UseGuards(RolesGuard)
  //@Roles('admin')
  @Bind(MessageBody(), ConnectedSocket())
  @SubscribeMessage('chat')
  handleMessage(chat: Chat, sender: any, @AuthUser() profile: Profile) {
    console.log('New Chat', chat);
    this.chatServise.create(chat);
    sender.emit('newChat', chat);
  }
}
