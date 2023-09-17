import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtModule } from '@nestjs/jwt';
import { LocalStrategy } from './strategies/local.strategy';
import { ConfigModule } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Profile, ProfileSchema } from 'src/profiles/schema/profile.schema';
import { Account, AccountSchema } from 'src/accounts/schema/account.schema';
import { ProfilesModule } from 'src/profiles/profiles.module';
import { AccountModule } from 'src/accounts/accounts.module';
import { HashModule } from 'src/hash/hash.module';
import { jwtOptions } from 'src/configs/jwt.config';

@Module({
  imports: [
    ProfilesModule,
    AccountModule,
    HashModule,
    PassportModule,
    ConfigModule,
    JwtModule.registerAsync(jwtOptions()),
    MongooseModule.forFeature([
      { name: Profile.name, schema: ProfileSchema },
      { name: Account.name, schema: AccountSchema },
    ]),
  ],
  providers: [AuthService, JwtStrategy, LocalStrategy],
  exports: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
