import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Bot, BotSchema } from './schema/bots.schema';
import { BotsController } from './bots.controller';
import { BotsService } from './bots.service';
import { BotsRepository } from './bots.repository';
import { ProfilesModule } from 'src/profiles/profiles.module';
import { FilesBucketService } from 'src/gridFS/gridFS.service';
import { AbilityModule } from 'src/ability/ability.module';
import { Profile, ProfileSchema } from 'src/profiles/schema/profile.schema';
import { GridFSModule } from 'src/gridFS/grifFS.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Bot.name, schema: BotSchema },
      { name: Profile.name, schema: ProfileSchema },
    ]),
    ProfilesModule,
    AbilityModule,
    GridFSModule,
  ],
  controllers: [BotsController],
  providers: [BotsService, BotsRepository, FilesBucketService],
  exports: [BotsService],
})
export class BotsModule {}
