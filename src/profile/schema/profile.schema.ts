import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type ProfileDocument = HydratedDocument<Profile>;

@Schema()
export class Profile {
  @Prop({ required: true, minlength: 2, maxlength: 30 })
  username: string;

  @Prop({ required: true })
  phone: string;

  @Prop({
    default: 'https://i.pravatar.cc/300',
  })
  avatar: string;

  @Prop({ default: 0 })
  balance: number;
}

export const ProfileSchema = SchemaFactory.createForClass(Profile);
