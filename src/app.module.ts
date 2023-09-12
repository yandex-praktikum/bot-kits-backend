import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProfilesController } from './profiles/profiles.controller';
import { AuthController } from './auth/auth.controller';
import { BotsController } from './bots/bots.controller';
import { botTemplatesController } from './botTemplates/bot-templates.controller';
import { ProfilesModule } from './profiles/profiles.module';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { PlatformModule } from './platforms/platforms.module';
import { AccountModule } from './account/accounts.module';
import { SubscriptionsController } from './subscriptions/subscriptions.controller';
import { SubscriptionsModule } from './subscriptions/subscriptions.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://127.0.0.1/nest'),
    ProfilesModule,
    AccountModule,
    AuthModule,
    PlatformModule,
    SubscriptionsModule,
  ],
  controllers: [
    AppController,
    AuthController,
    BotsController,
    botTemplatesController,
    SubscriptionsController,
  ],
  providers: [AppService],
})
export class AppModule {}
