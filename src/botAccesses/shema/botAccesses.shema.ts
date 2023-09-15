import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Bot } from '../../bots/schema/bots.schema';
import { Profile } from '../../profiles/schema/profile.schema';
import Permission from '../types/types';
import { ApiProperty } from '@nestjs/swagger';

@Schema()
export class BotAccess extends Document {
  @ApiProperty({ example: '64ff89e7faea577804940275' })
  _id: string;

  @ApiProperty({ example: '64ff89e7faea577804940275' })
  @Prop({
    type: Types.ObjectId,
    ref: 'Profile',
    required: true,
  })
  userId: Profile;

  @ApiProperty({ example: '64ff89e7faea577804940275' })
  @Prop({
    type: Types.ObjectId,
    ref: 'Bot',
    required: true,
  })
  botId: Bot;

  @ApiProperty({
    enum: [Permission.OWNER, Permission.LEVEL_1, Permission.LEVEL_2],
  })
  @Prop({
    enum: Permission,
    required: true,
  })
  permission: Permission;
}

export const BotAccessSchema = SchemaFactory.createForClass(BotAccess);
