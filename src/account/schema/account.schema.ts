import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, HydratedDocument, Types } from 'mongoose';

import TypeAccount from '../types/type-account';
import Role from '../types/role';
import { ApiProperty } from '@nestjs/swagger';
import { Profile } from 'src/profiles/schema/profile.schema';

export type AccountDocument = HydratedDocument<Account>;
//account.schema.ts
class Credentials {
  @ApiProperty({ example: 'my@mail.ru' })
  @Prop({ unique: true })
  email: string;

  @ApiProperty({ example: 'password123' })
  password: string;

  @ApiProperty({ example: 'dkskddksldlslsajsjsdsk,cmksjdksdjskjdk' })
  @Prop()
  accessToken: string;

  @ApiProperty({ example: 'dkskddksldlslsajsjsdsk,cmksjdksdjskjdk' })
  @Prop()
  refreshToken: string;
}

@Schema()
export class Account extends Document {
  @ApiProperty({ example: 'local' })
  @Prop({
    required: true,
    enum: TypeAccount,
    type: String,
    default: TypeAccount.LOCAL,
  })
  type: TypeAccount;

  @ApiProperty({ example: 'admin' })
  @Prop({ required: true, enum: Role, type: String })
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
