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
  user: Profile;
}

//chats.gateway.ts
@WebSocketGateway({
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Authorization'],
  },
})
export class WsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private pubClient: Redis;
  private subClient: Redis;
  private taskClient: Redis;
  private emitter: Emitter;
  private redisOptions: Record<string, string | number>;

  @WebSocketServer() server: Server = new Server();

  constructor(
    private readonly redisService: RedisService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly profilesService: ProfilesService,
    private readonly blacklistTokensService: BlacklistTokensService,
  ) {
    this.redisOptions = {
      host: configService.get<string>('REDIS_HOST'),
      port: +configService.get<string>('REDIS_PORT'),
    };
  }

  async onModuleInit() {
    const { emitter } = this.redisService;
    this.redisService.createClient(
      'pubClientWSGateway',
      this.redisOptions,
      true,
    );
    this.pubClient = this.redisService.getClient('pubClientWSGateway');

    this.redisService.createClient(
      'subClientWSGateway',
      this.redisOptions,
      true,
    );
    this.subClient = this.redisService.getClient('subClientWSGateway');

    this.redisService.createClient(
      'taskClientWSGateway',
      this.redisOptions,
      true,
    );
    this.taskClient = this.redisService.getClient('taskClientWSGateway');

    this.emitter = emitter;

    //--Интеграция адаптера Redis с сервером Socket.IO без явного вызова connect--//
    this.server.adapter(createAdapter(this.pubClient, this.subClient));

    //--Примените middleware к серверу Socket.IO для проверки авторизации--//
    this.server.use(
      socketMiddleware(
        this.jwtService,
        this.configService,
        this.profilesService,
        this.blacklistTokensService,
      ),
    );
  }

  //--Логика подключения пользователя--//
  handleConnection(client: AuthenticatedSocket, ...args: any[]) {
    //--Если пользователь авторизован, то мы имеем доступ к модели профиля из mongoDB--//
    const { user } = client;

    if (user) {
      //--TODO: возможно не нужный эмит на стороне клиента - под удаление--//
      client.emit('registered', { name: user.username, id: user._id });

      //--Подключаем пользователя в отдельную уникальную комнату--//
      client.join(`/user/${user._id}`); // Присоединение к комнате пользователя.

      //--Как только пользователь подключился публикуем событие в Redis для получения истории чатов именно этого пользователя--//
      this.pubClient.publish('register', JSON.stringify(user));

      //--TODO: возможно не нужный эмит на стороне клиента - под удаление--//
      this.pubClient.publish('get_rooms', JSON.stringify({ userId: user._id }));
    } else {
      console.error('Пользователь не аутентифицирован');
      client.disconnect();
    }
  }

  //--Логика создания чата с пользователем бота--//
  @SubscribeMessage('start-dialog')
  async handleStartDialog(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody()
    { from, to }: { from: string; to: string },
  ) {
    //--Гарантируем уникальность имени комнаты путем сортировки идентификаторов--//
    const participants = [from, to].sort();
    const roomName = `/${participants[0]}:${participants[1]}`;
    const roomNamereversed = `/${participants[1]}:${participants[0]}`;

    //--Проверяем, существует ли уже такая комната--//
    const existingRoom = [...client.rooms].find((room) => room === roomName);

    //--Если комнаты нет тогда присоединяем пользвоателя к двум комнатам с чатом--//
    if (!existingRoom) {
      client.join(roomName);
      client.join(roomNamereversed);
      //--TODO: возможно не нужный эмит на стороне клиента - под удаление--//
      client.emit('get-rooms', JSON.stringify({ rooms: [...client.rooms] }));
    } else {
      console.log(`Уже присоединен к комнате: ${existingRoom}`);
      //--TODO: возможно не нужный эмит на стороне клиента - под удаление--//
      client.emit('get-rooms', JSON.stringify({ rooms: [...client.rooms] }));
    }
  }

  //--Логика получения сообщения от клиента--//
  @SubscribeMessage('rootServerMessage')
  async handleMessage(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() msg: any,
  ) {
    //--Добавляем уникальное поле с идентификатором чата--//
    const messageWithChatId = {
      ...msg,
      chatId: `/${msg.participants[0]}:${msg.participants[1]}`,
    };

    //--Публикуем в Redis для сохраннеия истории--//
    this.pubClient.publish('message', JSON.stringify(messageWithChatId));
  }

  //--TODO: для уведомлений и прочего--//
  @SubscribeMessage('task')
  handleTask(@ConnectedSocket() client: Socket, @MessageBody() msg: any) {
    console.log(`task: `, msg);
    this.redisService.publish('task', JSON.stringify(msg)); // Публикация задачи в Redis.
  }

  //--TODO: доработать логику при отключении пользователя--//
  handleDisconnect(client: Socket) {
    console.log('user disconnected');
  }
}
