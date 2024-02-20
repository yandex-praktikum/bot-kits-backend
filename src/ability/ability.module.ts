import { Module } from '@nestjs/common';
import { AbilityFactory } from './ability.factory';
import { MongooseModule } from '@nestjs/mongoose';
import { Bot, BotSchema } from 'src/bots/schema/bots.schema';
import {
  Subscription,
  SubscriptionSchema,
} from 'src/subscriptions/schema/subscription.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Bot.name, schema: BotSchema },
      { name: Subscription.name, schema: SubscriptionSchema },
    ]),
  ],
  providers: [AbilityFactory],
  exports: [AbilityFactory], // Экспорт AbilityFactory
})
export class AbilityModule {}
