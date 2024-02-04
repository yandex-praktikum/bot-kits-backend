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
    const { emitter } = this.redisService;
    this.redisService.createClient(
      'pubClientWSGateway',
      { host: '127.0.0.1', port: 6379 },
      true,
    );
    this.pubClient = this.redisService.getClient('pubClientWSGateway');

    this.redisService.createClient(
      'subClientWSGateway',
      { host: '127.0.0.1', port: 6379 },
      true,
    );
    this.subClient = this.redisService.getClient('subClientWSGateway');

    this.redisService.createClient(
      'taskClientWSGateway',
      { host: '127.0.0.1', port: 6379 },
      true,
    );
    this.taskClient = this.redisService.getClient('taskClientWSGateway');

    this.emitter = emitter;

    // Интеграция адаптера Redis с сервером Socket.IO без явного вызова connect
    this.server.adapter(createAdapter(this.pubClient, this.subClient));
  }

  handleConnection(client: Socket, ...args: any[]) {
    console.log('a user connected');
    // // Обработчик события регистрации пользователя.
    // client.once('register', ({ id, name }) => {
    //   const userID = id ?? uuidv4(); // Генерация или использование существующего ID.
    //   console.log(`register: ${userID}`);
    //   client.emit('registered', { name, id: userID }); // Отправка данных о регистрации клиенту.
    //   client.join(`/user/${userID}`); // Присоединение к комнате пользователя.
    //   client.join('/chat'); // Присоединение к общей комнате чата.
    // });
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
    client.emit('get-rooms', JSON.stringify({ rooms: [...client.rooms] }));
  }

  @SubscribeMessage('start-dialog')
  handleStartDialog(
    @ConnectedSocket() client: Socket,
    @MessageBody() { from, to }: { from: string; to: string },
  ) {
    // Гарантируем уникальность имени комнаты путем сортировки идентификаторов
    const participants = [from, to].sort();
    const roomName = `/${participants[0]}:${participants[1]}`;

    // Проверяем, существует ли уже такая комната
    const existingRoom = [...client.rooms].find((room) => room === roomName);

    if (!existingRoom) {
      client.join(roomName);
      console.log(`Присоединение к комнате: ${roomName}`);
    } else {
      console.log(`Уже присоединен к комнате: ${existingRoom}`);
    }

    client.emit('start-dialog', JSON.stringify({ from, to, room: roomName }));
    client.emit('get-rooms', JSON.stringify({ rooms: [...client.rooms] }));
  }

  @SubscribeMessage('message')
  async handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() msg: any,
  ) {
    console.log(msg);
    this.server.to(`${msg.to}`).emit('message', msg); // Отправка сообщения всем в комнате чата.
    this.taskClient.publish('message', JSON.stringify(msg)); // Публикация сообщения в Redis.
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
