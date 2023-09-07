import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthController } from './auth/auth.controller';
import { BotsController } from './bots/bots.controller';
import { botTemplatesController } from './botTemplates/bot-templates.controller';
import { DatabaseModule } from './database//database.module';
import { ProfileModule } from './profile/profile.module';

@Module({
  imports: [DatabaseModule],
  controllers: [
    AppController,
    AuthController,
    BotsController,
    botTemplatesController,
  ],
  providers: [AppService],
})
export class AppModule {}
