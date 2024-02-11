//scr/profiles/profiles.module.ts
import { Module } from '@nestjs/common';
import { ProfilesService } from './profiles.service';
import { ProfilesController } from './profiles.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Profile, ProfileSchema } from './schema/profile.schema';
import { Account, AccountSchema } from 'src/accounts/schema/account.schema';
import { ProfilesRepository } from './profiles.repository';
import { HashModule } from 'src/hash/hash.module';
import { AbilityModule } from 'src/ability/ability.module';
import { Bot, BotSchema } from 'src/bots/schema/bots.schema';
import {
  Subscription,
  SubscriptionSchema,
} from 'src/subscriptions/schema/subscription.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Profile.name, schema: ProfileSchema },
      { name: Account.name, schema: AccountSchema },
      { name: Bot.name, schema: BotSchema },
      { name: Subscription.name, schema: SubscriptionSchema },
    ]),
    AbilityModule,
    HashModule,
  ],
  controllers: [ProfilesController],
  providers: [ProfilesService, ProfilesRepository],
  exports: [ProfilesService],
})
export class ProfilesModule {}
