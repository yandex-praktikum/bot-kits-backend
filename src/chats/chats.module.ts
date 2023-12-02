import { Module } from '@nestjs/common';
import { ChatsService } from './chats.service';
import { ChatsController } from './chats.controller';
import { Chat, ChatSchema } from './schema/chat.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { WsGateway } from './gateway/chats.gateway';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { WSGuard } from 'src/auth/guards/ws.guards';
import { ProfilesModule } from 'src/profiles/profiles.module';
import { BlacklistTokensModule } from 'src/blacklistTokens/blacklistTokens.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Chat.name, schema: ChatSchema }]),
    ProfilesModule,
    BlacklistTokensModule,
  ],
  controllers: [ChatsController],
  providers: [WsGateway, ChatsService, ConfigService, JwtService, WSGuard],
})
export class ChatsModule {}
