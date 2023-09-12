import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthController } from "./auth/auth.controller";
import { BotsController } from "./bots/bots.controller";
import { ProfilesModule } from "./profiles/profiles.module";
import { MongooseModule } from "@nestjs/mongoose";
import { AuthModule } from "./auth/auth.module";
import { PlatformModule } from "./platforms/platforms.module";
import { BotTemplatesModule } from "./botTemplates/bot-templates.module";

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost/nest'),
    ProfilesModule,
    AuthModule,
    PlatformModule,
    BotTemplatesModule
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
