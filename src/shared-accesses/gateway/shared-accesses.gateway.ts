import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
} from '@nestjs/websockets';
import { SharedAccessesService } from '../shared-accesses.service';
import { CreateSharedAccessDto } from '../dto/create-shared-access.dto';
import { UpdateSharedAccessDto } from '../dto/update-shared-access.dto';
import { UseGuards } from '@nestjs/common';
import { WSGuard } from 'src/auth/guards/ws.guards';
import { NestGateway } from '@nestjs/websockets/interfaces/nest-gateway.interface';
import { Server, Socket } from 'socket.io';

@UseGuards(WSGuard)
@WebSocketGateway({ port: 3001, namespace: '/sharedaccesses' })
export class SharedAccessesGateway implements NestGateway {
  @WebSocketServer() server: Server;
  constructor(private readonly sharedAccessesService: SharedAccessesService) {}

  afterInit() {
    console.log('Init');
  }

  handleConnection(socket: Socket) {
    if (!socket.handshake.headers.authorization) {
      socket.disconnect();
    }
    console.log('Connect', socket.id);
  }

  handleDisconnect(socket: Socket) {
    console.log('Disconnect', socket.id);
  }

  @SubscribeMessage('createSharedAccess')
  create(@MessageBody() createSharedAccessDto: CreateSharedAccessDto) {
    return this.sharedAccessesService.create(createSharedAccessDto);
  }

  @SubscribeMessage('getAll')
  async findAll() {
    const allAccesses = await this.sharedAccessesService.findAll();
    this.server.emit('getAll', allAccesses);
  }

  @SubscribeMessage('updateSharedAccess')
  async update(@MessageBody() updateSharedAccessDto: UpdateSharedAccessDto) {
    const updatedAccess = await this.sharedAccessesService.updateByEmail(
      updateSharedAccessDto,
    );
    if (!updatedAccess) {
      return this.server.emit('error', {
        message: 'Некорректный email и/или username',
      });
    }
    return this.server.emit('updated', updatedAccess);
  }
}
