import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProfilesController } from './profiles/profiles.controller';
import { AuthController } from './auth/auth.controller';
import { BotsController } from './bots/bots.controller';
import { DatabaseModule } from './database/database.module';
import { ProfilesModule } from './profiles/profiles.module';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { TariffsModule } from './tariff/tariffs.module';
import { PlatformModule } from './platforms/platforms.module';
import { AccountModule } from './account/accounts.module';
import { BotTemplatesModule } from "./botTemplates/bot-templates.module";
import { SubscriptionsController } from './subscriptions/subscriptions.controller';
import { SubscriptionsModule } from './subscriptions/subscriptions.module';
import { PaymentsController } from './payments/payments.controller';
import { PaymentsModule } from './payments/payments.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://127.0.0.1/nest'),
    ProfilesModule,
    TariffsModule,
    AccountModule,
    AuthModule,
    PlatformModule,
    BotTemplatesModule
    SubscriptionsModule,
    PaymentsModule,
  ],
  controllers: [
    AppController,
    AuthController,
    BotsController,
    botTemplatesController,
    SubscriptionsController,
    PaymentsController,
  ],
  providers: [AppService],
})
export class AppModule {}
