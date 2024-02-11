import { Module, forwardRef } from '@nestjs/common';
import { AbilityFactory } from './ability.factory';
import { MongooseModule } from '@nestjs/mongoose';
import { Bot, BotSchema } from 'src/bots/schema/bots.schema';
import { SubscriptionsModule } from 'src/subscriptions/subscriptions.module';
import { TariffsModule } from 'src/tariffs/tariffs.module';
import { BotsModule } from 'src/bots/bots.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Bot.name, schema: BotSchema }]),
    forwardRef(() => BotsModule),
    forwardRef(() => TariffsModule),
    SubscriptionsModule,
  ],
  providers: [AbilityFactory],
  exports: [AbilityFactory], // Экспорт AbilityFactory
})
export class AbilityModule {}
