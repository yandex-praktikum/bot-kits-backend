import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { config } from './configs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';

//controllers
import { AuthController } from './auth/auth.controller';
import { BotsController } from './bots/bots.controller';
import { BotTemplatesController } from './botTemplates/bot-templates.controller';
import { ProfilesController } from './profiles/profiles.controller';

import { ProfilesModule } from './profiles/profiles.module';
import { AuthModule } from './auth/auth.module';
import { BotAccessesModule } from './botAccesses/botAccesses.module';
import { TariffsModule } from './tariff/tariffs.module';
import { PlatformModule } from './platforms/platforms.module';

import { AccountModule } from './accounts/accounts.module';
import { databaseConfig } from './configs/database.config';

import { BotsModule } from './bots/bots.module';

import { SubscriptionsController } from './subscriptions/subscriptions.controller';
import { SubscriptionsModule } from './subscriptions/subscriptions.module';
import { PaymentsController } from './payments/payments.controller';
import { PaymentsModule } from './payments/payments.module';
import { TariffsController } from './tariff/tariffs.controller';
import { AccountController } from './accounts/accounts.controller';
import { BotAccessesController } from './botAccesses/botAccesses.controller';
import { PlatformController } from './platforms/platforms.controller';
import { BotTemplatesModule } from './botTemplates/bot-templates.module';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
    }),
    MongooseModule.forRootAsync(databaseConfig()),
    ProfilesModule,
    TariffsModule,
    AccountModule,
    AuthModule,
    BotAccessesModule,
    PlatformModule,
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
