import { Module } from '@nestjs/common';
import { AbilityFactory } from './ability.factory';
import { MongooseModule } from '@nestjs/mongoose';
import { Bot, BotSchema } from 'src/bots/schema/bots.schema';
import {
  Subscription,
  SubscriptionSchema,
} from 'src/subscriptions/schema/subscription.schema';
import { Tariff, TariffSchema } from 'src/tariffs/schema/tariff.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Bot.name, schema: BotSchema },
      { name: Subscription.name, schema: SubscriptionSchema },
      { name: Tariff.name, schema: TariffSchema },
    ]),
  ],
  providers: [AbilityFactory],
  exports: [AbilityFactory], // Экспорт AbilityFactory
})
export class AbilityModule {}
