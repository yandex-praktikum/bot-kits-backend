import { INestApplicationContext } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { Server, ServerOptions } from 'socket.io';
import { socketMiddleware } from './socketMiddleware';
import { ProfilesService } from 'src/profiles/profiles.service';
import { BlacklistTokensService } from 'src/blacklistTokens/blacklistTokens.service';

export class SocketIoAdapter extends IoAdapter {
  constructor(
    private app: INestApplicationContext,
    private configService: ConfigService,
    private cors: any,
  ) {
    super(app);
  }

  createIOServer(port: number, options?: ServerOptions) {
    // const clientUrl = 'http://localhost:3000';

    // const cors = this.cors.origin.push(clientUrl);

    const optionsWithCORS: ServerOptions = {
      ...options,
      // cors,
    };

    const jwtService = this.app.get(JwtService);
    const configService = this.app.get(ConfigService);
    const profilesService = this.app.get(ProfilesService);
    const blacklistTokensService = this.app.get(BlacklistTokensService);
    const server: Server = super.createIOServer(port, optionsWithCORS);

    server
      .of('chats')
      .use(
        socketMiddleware(
          jwtService,
          configService,
          profilesService,
          blacklistTokensService,
        ),
      );

    return server;
  }
}
