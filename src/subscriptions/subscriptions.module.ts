import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SubscriptionsService } from './subscriptions.service';
import { SubscriptionsController } from './subscriptions.controller';
import { Subscription, SubscriptionSchema } from './schema/subscription.schema';
import { Profile, ProfileSchema } from '../profiles/schema/profile.schema';
import { Payment, PaymentSchema } from '../payments/schema/payment.schema';
import { Tariff, TariffSchema } from 'src/tariffs/schema/tariff.schema';
import { SubscriptionsRepository } from './subscriptions.repository';
import { SchedulerModule } from 'src/scheduler/scheduler.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Subscription.name, schema: SubscriptionSchema },
      { name: Profile.name, schema: ProfileSchema },
      { name: Payment.name, schema: PaymentSchema },
      { name: Tariff.name, schema: TariffSchema },
    ]),
    SchedulerModule,
  ],
  controllers: [SubscriptionsController],
  providers: [SubscriptionsRepository, SubscriptionsService],
  exports: [SubscriptionsService],
})
export class SubscriptionsModule {}
