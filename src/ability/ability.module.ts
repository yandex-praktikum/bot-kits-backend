import { Module } from '@nestjs/common';
import { AbilityFactory } from './ability.factory';
import { MongooseModule } from '@nestjs/mongoose';
import { Bot, BotSchema } from 'src/bots/schema/bots.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Bot.name, schema: BotSchema }])],
  providers: [AbilityFactory],
  exports: [AbilityFactory], // Экспорт AbilityFactory
})
export class AbilityModule {}
