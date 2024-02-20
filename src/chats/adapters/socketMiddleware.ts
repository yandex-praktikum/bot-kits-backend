import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { WsException } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { BlacklistTokensService } from 'src/blacklistTokens/blacklistTokens.service';
import { ProfilesService } from 'src/profiles/profiles.service';
import { TJwtRequest } from 'src/types/jwtRequest';

//socketMiddleware.ts
export const socketMiddleware =
  (
    jwtService: JwtService,
    configService: ConfigService,
    profilesService: ProfilesService,
    blacklistTokensService: BlacklistTokensService,
  ) =>
  async (socket: Socket & TJwtRequest, next) => {
    const token = socket.handshake.headers?.authorization
      ? socket.handshake.headers.authorization.replace('Bearer ', '')
      : undefined;

    try {
      if (!token) {
        throw new Error('Токен отсутствует');
      }

      const jwtPayload = jwtService.verify(token, {
        secret: configService.get('JWT_SECRET'),
      });

      const user = await profilesService.findOne(jwtPayload.sub);

      if ((await blacklistTokensService.isTokenBlacklisted(token)) || !user) {
        throw new Error('Пользователь не авторизован');
      }

      //--Прикрепляем объект пользователя к socket для последующего использования--//
      socket.user = user;

      next();
    } catch (err) {
      next(new WsException(err));
    }
  };
