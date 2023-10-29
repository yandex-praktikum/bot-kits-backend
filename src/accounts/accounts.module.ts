//src/account/account.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AccountService } from './accounts.service';
import { AccountController } from './accounts.controller';
import { Account, AccountSchema } from './schema/account.schema';
import { HashModule } from 'src/hash/hash.module';
import { ProfilesModule } from 'src/profiles/profiles.module';
import { AccountsRepository } from './accounts.repository';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Account.name, schema: AccountSchema }]),
    HashModule,
    ProfilesModule,
  ],
  controllers: [AccountController],
  providers: [AccountService, AccountsRepository],
  exports: [AccountService],
})
export class AccountModule {}
