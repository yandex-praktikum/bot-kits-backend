import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { botTemplatesController } from './botTemplates/bot-templates.controller';
import { ProfilesModule } from './profiles/profiles.module';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { PlatformModule } from './platforms/platforms.module';
import { AccountModule } from './account/accounts.module';
import { BotsModule } from "./bots/bots.module";

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://127.0.0.1/nest'),
    ProfilesModule,
    AccountModule,
    AuthModule,
    PlatformModule,
    BotsModule,
  ],
  controllers: [
    AppController,
    botTemplatesController,
  ],
  providers: [AppService],
})
export class AppModule {}
