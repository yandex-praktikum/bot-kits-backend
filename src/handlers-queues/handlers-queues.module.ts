import { Module } from '@nestjs/common';
import { HandlersQueuesService } from './handlers-queues.service';
import { RabbitmqModule } from 'src/rabbitmq/rabbitmq.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Subscription } from 'rxjs';
import { Payment, PaymentSchema } from 'src/payments/schema/payment.schema';
import { Profile, ProfileSchema } from 'src/profiles/schema/profile.schema';
import { SubscriptionSchema } from 'src/subscriptions/schema/subscription.schema';
import { Tariff, TariffSchema } from 'src/tariffs/schema/tariff.schema';

@Module({
  imports: [
    RabbitmqModule,
    MongooseModule.forFeature([
      { name: Subscription.name, schema: SubscriptionSchema },
      { name: Payment.name, schema: PaymentSchema },
      { name: Tariff.name, schema: TariffSchema },
      { name: Profile.name, schema: ProfileSchema },
    ]),
  ],
  providers: [HandlersQueuesService],
})
export class HandlersQueuesModule {}
