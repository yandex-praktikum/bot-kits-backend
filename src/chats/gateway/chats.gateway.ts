// ws.gateway.ts
import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { RedisService } from 'src/redis/redis.service';
import { v4 as uuidv4 } from 'uuid';
import { createAdapter } from '@socket.io/redis-adapter';
import { Redis, RedisOptions } from 'ioredis';
import { Emitter } from '@socket.io/redis-emitter';

@WebSocketGateway()
export class WsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private pubClient: Redis;
  private subClient: Redis;
  private taskClient: Redis;
  private emitter: Emitter;

  @WebSocketServer() server: Server;

  constructor(private redisService: RedisService) {}

  async onModuleInit() {
    const { pubClient, subClient, emitter, taskClient } = this.redisService;
    this.pubClient = pubClient;
    this.subClient = subClient;
    this.taskClient = taskClient;
    this.emitter = emitter;

    // Интеграция адаптера Redis с сервером Socket.IO без явного вызова connect
    this.server.adapter(createAdapter(pubClient, subClient));
  }

  handleConnection(client: Socket, ...args: any[]) {
    console.log('a user connected');
  }

  @SubscribeMessage('register')
  handleRegister(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { id?: string; name: string },
  ) {
    const userID = data.id ?? uuidv4(); // Генерация или использование существующего ID.
    console.log(`register: ${userID}`);

    client.emit('registered', { name: data.name, id: userID });
    client.join(`/user/${userID}`); // Присоединение к комнате пользователя.
    client.join('/chat'); // Присоединение к общей комнате чата.
  }

  @SubscribeMessage('start-dialog')
  handleStartDialog(
    @ConnectedSocket() client: Socket,
    @MessageBody() { from, to }: { from: string; to: string },
  ) {
    client.join(`/${from}:${to}`); // Присоединение к приватной комнате для диалога.
    this.server.to(`/user/${to}`).emit('invite', { from, to }); // Отправка приглашения другому пользователю.
  }

  @SubscribeMessage('message')
  handleMessage(@ConnectedSocket() client: Socket, @MessageBody() msg: any) {
    console.log(`message: `, msg);
    this.server.to('/chat').emit('message', msg); // Отправка сообщения всем в комнате чата.
    this.redisService.publish('message', JSON.stringify(msg)); // Публикация сообщения в Redis.
  }

  @SubscribeMessage('task')
  handleTask(@ConnectedSocket() client: Socket, @MessageBody() msg: any) {
    console.log(`task: `, msg);
    this.redisService.publish('task', JSON.stringify(msg)); // Публикация задачи в Redis.
  }

  handleDisconnect(client: Socket) {
    console.log('user disconnected');
  }
}
