import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Bot, BotSchema } from './schema/bots.schema';
import { BotsController } from './bots.controller';
import { BotsService } from './bots.service';
import { BotsRepository } from './bots.repository';
import { ProfilesModule } from 'src/profiles/profiles.module';
import { AbilityModule } from 'src/ability/ability.module';
import { Profile, ProfileSchema } from 'src/profiles/schema/profile.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Bot.name, schema: BotSchema },
      { name: Profile.name, schema: ProfileSchema },
    ]),
    forwardRef(() => ProfilesModule),
    forwardRef(() => AbilityModule),
  ],
  controllers: [BotsController],
  providers: [BotsService, BotsRepository],
  exports: [BotsService],
})
export class BotsModule {}
