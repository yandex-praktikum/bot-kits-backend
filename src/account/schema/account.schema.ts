import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

import { Profile } from '../../profiles/schema/profile.schema';

import TypeAccount from '../types/type-account';
import Role from '../types/role';
import { ApiProperty } from '@nestjs/swagger';

export type AccountDocument = HydratedDocument<Account>;

class Credentials {
  @ApiProperty({ example: 'my@mail.ru' })
  email: string;

  @ApiProperty({ example: 'password123' })
  password: string;

  @ApiProperty({ example: 'dkskddksldlslsajsjsdsk,cmksjdksdjskjdk' })
  accessToken: string;

  @ApiProperty({ example: 'dkskddksldlslsajsjsdsk,cmksjdksdjskjdk' })
  refreshToken: string;
}

@Schema()
export class Account {
  @ApiProperty({ example: 'local' })
  @Prop({
    required: true,
    enum: TypeAccount,
    type: String,
    default: TypeAccount.LOCAL,
  })
  type: TypeAccount;

  @ApiProperty({ example: 'admin' })
  @Prop({ required: true, enum: Role, type: String, default: Role.USER })
  role: Role;

  @ApiProperty({
    example: {
      email: 'my@mail.ru',
      password: 'password123',
      accessToken: 'dkskddksldlslsajsjsdsk,cmksjdksdjskjdk',
      refreshToken: 'dkskddksldlslsajsjsdsk,cmksjdksdjskjdk',
    },
  })
  @Prop({ type: Credentials })
  credentials: Credentials;

  @ApiProperty()
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Profile' })
  profile: Profile;
}

export const AccountSchema = SchemaFactory.createForClass(Account);
