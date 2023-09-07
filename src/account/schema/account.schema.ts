import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

import { Profile } from '../../profile/schema/profile.schema';

import TypeAccount from '../types/type-account';
import Role from '../types/role';

export type AccountDocument = HydratedDocument<Account>;

@Schema({ _id: false })
class Credentials {
  @Prop()
  email: string;

  @Prop()
  password: string;

  @Prop()
  accessToken: string;

  @Prop()
  refreshToken: string;
}

@Schema()
export class Account {
  @Prop({
    required: true,
    enum: TypeAccount,
    type: String,
    default: TypeAccount.LOCAL,
  })
  type: TypeAccount;

  @Prop({ required: true, enum: Role, type: String, default: Role.USER })
  role: Role;

  @Prop()
  credentials: Credentials;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Profile' })
  profile: Profile;
}

export const AccountSchema = SchemaFactory.createForClass(Account);
