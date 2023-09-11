import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProfilesController } from './profiles/profiles.controller';
import { AuthController } from './auth/auth.controller';
import { BotsController } from './bots/bots.controller';
import { botTemplatesController } from './botTemplates/bot-templates.controller';
import { DatabaseModule } from './database//database.module';
import { ProfilesModule } from './profiles/profiles.module';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { BotAccessesModule } from "./botAccesses/botAccesses.module";

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost/nest'),
    ProfilesModule,
    AuthModule,
    BotAccessesModule,
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
