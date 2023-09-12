import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';

import { AuthController } from './auth/auth.controller';
import { BotsController } from './bots/bots.controller';
import { botTemplatesController } from './botTemplates/bot-templates.controller';

import { ProfilesModule } from './profiles/profiles.module';
import { AuthModule } from './auth/auth.module';
import { PlatformModule } from './platforms/platforms.module';
import { AccountModule } from './accounts/accounts.module';

import { config } from './configs/config';
import { databaseConfig } from './configs/database.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
    }),
    MongooseModule.forRootAsync(databaseConfig()),
    ProfilesModule,
    AccountModule,
    AuthModule,
    PlatformModule,
  ],
  controllers: [
    AppController,
    AuthController,
    BotsController,
    botTemplatesController,
  ],
  providers: [AppService],
})
export class AppModule {}
