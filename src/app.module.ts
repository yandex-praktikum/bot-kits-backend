import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthController } from './auth/auth.controller';
import { BotsController } from './bots/bots.controller';
import { botTemplatesController } from './botTemplates/bot-templates.controller';
import { DatabaseModule } from './database/database.module';
import { ProfileModule } from './profiles/profile.module';
import { AccountModule } from './account/account.module';

@Module({
  imports: [DatabaseModule, ProfileModule, AccountModule],
  controllers: [
    AppController,
    AuthController,
    BotsController,
    botTemplatesController,
  ],
  providers: [AppService],
})
export class AppModule {}
