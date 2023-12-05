import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Bot, BotSchema } from './schema/bots.schema';
import { BotsController } from './bots.controller';
import { BotsService } from './bots.service';
import { BotAccessesModule } from '../botAccesses/botAccesses.module';
import { BotsRepository } from './bots.repository';
import { ProfilesModule } from 'src/profiles/profiles.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Bot.name, schema: BotSchema }]),
    BotAccessesModule,
    ProfilesModule,
  ],
  controllers: [BotsController],
  providers: [BotsService, BotsRepository],
})
export class BotsModule {}
