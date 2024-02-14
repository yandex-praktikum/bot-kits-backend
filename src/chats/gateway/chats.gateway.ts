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
import { Redis } from 'ioredis';
import { Emitter } from '@socket.io/redis-emitter';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { BlacklistTokensService } from 'src/blacklistTokens/blacklistTokens.service';
import { ProfilesService } from 'src/profiles/profiles.service';
import { socketMiddleware } from '../adapters/socketMiddleware';
import { Profile } from 'src/profiles/schema/profile.schema';

interface AuthenticatedSocket extends Socket {
  user: Profile; // User - предполагается ваш тип пользователя
}

//chats.gateway.ts
@WebSocketGateway()
export class WsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private pubClient: Redis;
  private subClient: Redis;
  private taskClient: Redis;
  private emitter: Emitter;

  @WebSocketServer() server: Server = new Server();

  constructor(
    private readonly redisService: RedisService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly profilesService: ProfilesService,
    private readonly blacklistTokensService: BlacklistTokensService,
  ) {}

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

    // Примените middleware к вашему серверу Socket.IO
    this.server.use(
      socketMiddleware(
        this.jwtService,
        this.configService,
        this.profilesService,
        this.blacklistTokensService,
      ),
    );
  }

  handleConnection(client: AuthenticatedSocket, ...args: any[]) {
    console.log('Пользователь подключился');
    const { user } = client;

    if (client.user) {
      console.log(`Пользователь ${user.username} подключен`);
      // Теперь вы можете использовать данные пользователя для любых целей
      client.emit('registered', { name: user.username, id: user._id });
      client.join(`/user/${user._id}`); // Присоединение к комнате пользователя.
      this.pubClient.publish('register', `${user._id}`);
    } else {
      console.log('Пользователь не аутентифицирован');
    }
  }

  @SubscribeMessage('start-dialog')
  async handleStartDialog(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody()
    { from, to }: { from: string; to: string },
  ) {
    // Гарантируем уникальность имени комнаты путем сортировки идентификаторов
    const participants = [from, to].sort();
    const roomName = `/${participants[0]}:${participants[1]}`;
    const roomNamereversed = `/${participants[1]}:${participants[0]}`;

    // Проверяем, существует ли уже такая комната
    const existingRoom = [...client.rooms].find((room) => room === roomName);

    if (!existingRoom) {
      client.join(roomName);
      client.join(roomNamereversed);
      console.log(
        `Присоединение к комнате: ${roomName} и к комнате ${roomNamereversed}`,
      );
      client.emit('get-rooms', JSON.stringify({ rooms: [...client.rooms] }));
      //this.taskClient.publish('message', JSON.stringify({ from, to, message }));
      // Также можете здесь добавить логику для создания метаданных нового чата в Redis
      await this.pubClient.set(
        `chat:${roomName}`,
        JSON.stringify({ roomName, roomNamereversed }),
      );
    } else {
      console.log(`Уже присоединен к комнате: ${existingRoom}`);
      client.emit('get-rooms', JSON.stringify({ rooms: [...client.rooms] }));
    }
  }

  @SubscribeMessage('message')
  async handleMessage(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() msg: any,
  ) {
    console.log(`/${msg.participants[0]}:${msg.participants[1]}`);
    this.server
      .to(`/${msg.participants[0]}:${msg.participants[1]}`)
      .emit('message', msg); // Отправка сообщения всем в комнате чата.
    this.pubClient.publish(
      'message',
      JSON.stringify({
        ...msg,
        chatId: `/${msg.participants[0]}:${msg.participants[1]}`,
      }),
    ); // Публикация сообщения в Redis.
  }

  @SubscribeMessage('task')
  handleTask(@ConnectedSocket() client: Socket, @MessageBody() msg: any) {
    console.log(`task: `, msg);
    this.redisService.publish('task', JSON.stringify(msg)); // Публикация задачи в Redis.
  }

  handleDisconnect(client: Socket) {
    console.log('user disconnected');
  }

  // @SubscribeMessage('register')
  // handleRegister(
  //   @ConnectedSocket() client: AuthenticatedSocket,
  //   @MessageBody() data: { id?: string; name: string },
  // ) {
  //   const userID = data.id ?? uuidv4(); // Генерация или использование существующего ID.
  //   console.log(`register: ${userID}`);

  //   client.emit('registered', { name: data.name, id: userID });
  //   client.join(`/user/${userID}`); // Присоединение к комнате пользователя.
  //   //client.join('/chat'); // Присоединение к общей комнате чата.
  //   client.emit('get-rooms', JSON.stringify({ rooms: [...client.rooms] }));
  //   this.pubClient.publish('register', `${userID}`);
  // }
}
