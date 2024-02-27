import { Logger, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { AuthController } from './auth/auth.controller';

import { ProfilesModule } from './profiles/profiles.module';
import { AuthModule } from './auth/auth.module';
import { TariffsModule } from './tariffs/tariffs.module';
import { PlatformModule } from './platforms/platforms.module';

import { PromocodesModule } from './promocodes/promocodes.module';

import { AccountsModule } from './accounts/accounts.module';
import { databaseConfig } from './configs/database.config';

import { BotsModule } from './bots/bots.module';
import { SubscriptionsModule } from './subscriptions/subscriptions.module';

import { MailingModule } from './mailing/mailing.module';

import { StatisticsModule } from './statistics/statistics.module';
import { PaymentsModule } from './payments/payments.module';
import { HttpModule } from '@nestjs/axios';
import { NotificationModule } from './notifications/notifications.module';
import { BlacklistTokensModule } from './blacklistTokens/blacklistTokens.module';
import { throttlerConfig } from './configs/throttler.config';
import { PartnershipModule } from './partnership/partnership.module';
import { GlobalHTTPExceptionFilter } from './utils/globalFilterHTTP.exception';
import { HandlersQueuesModule } from './handlers-queues/handlers-queues.module';
import { ChatsModule } from './chats/chats.module';
import { RedisModule } from './redis/redis.module';
import { GridFSModule } from './gridFS/grifFS.module';

//app.module.ts
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.dev', '.env'],
    }),
    ThrottlerModule.forRootAsync(throttlerConfig()),
    MongooseModule.forRootAsync(databaseConfig()),
    ProfilesModule,
    TariffsModule,
    AccountsModule,
    AuthModule,
    PlatformModule,
    PromocodesModule,
    BotsModule,
    SubscriptionsModule,
    StatisticsModule,
    PaymentsModule,
    HttpModule,
    NotificationModule,
    BlacklistTokensModule,
    ChatsModule,
    PartnershipModule,
    MailingModule,
    HandlersQueuesModule,
    GridFSModule,
  ],
  controllers: [AppController, AuthController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    Logger,
    {
      provide: APP_FILTER,
      useClass: GlobalHTTPExceptionFilter,
    },
  ],
})
export class AppModule {}
