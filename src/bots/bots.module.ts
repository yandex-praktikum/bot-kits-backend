import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Bot, BotSchema } from './schema/bots.schema';
import { BotsController } from './bots.controller';
import { BotsService } from './bots.service';
import { BotAccessesModule } from '../botAccesses/botAccesses.module';
import { BotsRepository } from './bots.repository';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Bot.name, schema: BotSchema }]),
    BotAccessesModule,
  ],
  controllers: [BotsController],
  providers: [BotsService, BotsRepository],
})
export class BotsModule {}
