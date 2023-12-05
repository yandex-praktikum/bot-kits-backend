import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ConfigService } from '@nestjs/config';

import { JwtService } from '@nestjs/jwt';
import { ProfilesService } from 'src/profiles/profiles.service';
import { BlacklistTokensService } from 'src/blacklistTokens/blacklistTokens.service';

//ws.guards.ts
@Injectable()
export class WSGuard implements CanActivate {
  @WebSocketServer()
  server: Server;

  constructor(
    private configService: ConfigService,
    private profilesService: ProfilesService,
    private blacklistTokensService: BlacklistTokensService,
    private jwtService: JwtService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const client: Socket = context.switchToWs().getClient();
    const token = client.handshake.headers.authorization.replace('Bearer ', '');

    if (!token) {
      client.emit('authError', { message: 'Токен отсутствует' });
      client.disconnect();
      return false;
    }

    let jwtPayload;
    try {
      jwtPayload = this.jwtService.verify(token, {
        secret: this.configService.get('JWT_SECRET'),
      });
    } catch (e) {
      client.emit('authError', { message: 'Неверный токен' });
      client.disconnect();
      return false;
    }

    const user = await this.profilesService.findOne(jwtPayload.sub);
    if (
      (await this.blacklistTokensService.isTokenBlacklisted(token)) ||
      !user
    ) {
      client.emit('authError', { message: 'Пользователь не авторизован' });
      client.disconnect();
      return false;
    }

    client.data.user = user; // Сохраняем информацию о пользователе в объекте client для последующего использования
    return true;
  }
}
