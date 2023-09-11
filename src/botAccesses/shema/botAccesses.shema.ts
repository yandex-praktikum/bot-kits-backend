import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Profile } from '../../profiles/schema/profile.schema';
import Permission from '../types/types';


@Schema({ timestamps: true }) //Включает поля createdAt и updatedAt
export class BotAccess extends Document {
  @Prop({
    type: Types.ObjectId,
    ref: 'Profile',
    required: true })
  userId: Profile;


// пока просто строка вместо сущности Bot
  // @Prop({
  //   type: Types.ObjectId,
  //   ref: 'Bot',
  //   required: true })
  // botId: Bot;

  @Prop({
    required: true })
  botId: string;

  @Prop({
    enum: Permission,
    required: true,
    })
  permission: Permission;
}

export const BotAccessSchema = SchemaFactory.createForClass(BotAccess);
