import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';

import { AuthController } from './auth/auth.controller';
import { BotsController } from './bots/bots.controller';
import { botTemplatesController } from './botTemplates/bot-templates.controller';
import { botTemplatesController } from './botTemplates/bot-templates.controller';
import { ProfilesController } from './profiles/profiles.controller';
import { AuthController } from './auth/auth.controller';
import { BotsController } from './bots/bots.controller';
import { DatabaseModule } from './database/database.module';

import { ProfilesModule } from './profiles/profiles.module';
import { AuthModule } from './auth/auth.module';
import { BotAccessesModule } from "./botAccesses/botAccesses.module";
import { TariffsModule } from './tariff/tariffs.module';
import { PlatformModule } from './platforms/platforms.module';

import { AccountModule } from './accounts/accounts.module';

import { config } from './configs/config';
import { databaseConfig } from './configs/database.config';

import { AccountModule } from './account/accounts.module';
import { BotsModule } from "./bots/bots.module";
import { BotTemplatesModule } from "./botTemplates/bot-templates.module";
import { SubscriptionsController } from './subscriptions/subscriptions.controller';
import { SubscriptionsModule } from './subscriptions/subscriptions.module';
import { PaymentsController } from './payments/payments.controller';
import { PaymentsModule } from './payments/payments.module';

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
    BotTemplatesModule
    SubscriptionsModule,
    PaymentsModule,
  ],
  controllers: [
    AppController,
    botTemplatesController,
    SubscriptionsController,
    PaymentsController,
  ],
  providers: [AppService],
})
export class AppModule {}
