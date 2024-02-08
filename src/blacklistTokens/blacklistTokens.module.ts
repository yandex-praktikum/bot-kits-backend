import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BlacklistTokensService } from './blacklistTokens.service';
import {
  BlacklistTokens,
  BlacklistTokensSchema,
} from './schema/blacklistTokens.schema';
import { BlacklistTokensController } from './blacklistTokens.controller';
import { BlacklistTokensRepository } from './blacklistTokens.repository';
import { JwtService } from '@nestjs/jwt';
import { Profile, ProfileSchema } from '../profiles/schema/profile.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: BlacklistTokens.name, schema: BlacklistTokensSchema },
      { name: Profile.name, schema: ProfileSchema },
    ]),
  ],
  controllers: [BlacklistTokensController],
  providers: [BlacklistTokensService, BlacklistTokensRepository, JwtService],
  exports: [BlacklistTokensService],
})
export class BlacklistTokensModule {}
