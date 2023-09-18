import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';

//controllers
import { AuthController } from './auth/auth.controller';

import { ProfilesModule } from './profiles/profiles.module';
import { AuthModule } from './auth/auth.module';
import { BotAccessesModule } from './botAccesses/botAccesses.module';
import { TariffsModule } from './tariffs/tariffs.module';
import { PlatformModule } from './platforms/platforms.module';

import { PromocodesModule } from './promocodes/promocodes.module';

import { AccountModule } from './accounts/accounts.module';
import { databaseConfig } from './configs/database.config';

import { BotsModule } from './bots/bots.module';
import { SubscriptionsModule } from './subscriptions/subscriptions.module';
import { PaymentsModule } from './payments/payments.module';
import { BotTemplatesModule } from './botTemplates/bot-templates.module';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.dev', '.env'],
    }),
    MongooseModule.forRootAsync(databaseConfig()),
    ProfilesModule,
    TariffsModule,
    AccountModule,
    AuthModule,
    BotAccessesModule,
    PlatformModule,
    PromocodesModule,
    BotsModule,
    BotTemplatesModule,
    SubscriptionsModule,
    PaymentsModule,
    HttpModule,
  ],
  controllers: [AppController, AuthController],
  providers: [AppService],
})
export class AppModule {}
