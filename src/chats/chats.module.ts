import { Module } from '@nestjs/common';
import { WsGateway } from './gateway/chats.gateway';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { ProfilesModule } from 'src/profiles/profiles.module';
import { BlacklistTokensModule } from 'src/blacklistTokens/blacklistTokens.module';
import { RedisService } from 'src/redis/redis.service';

@Module({
  imports: [ProfilesModule, BlacklistTokensModule],
  controllers: [],
  providers: [WsGateway, ConfigService, JwtService, RedisService],
})
export class ChatsModule {}
