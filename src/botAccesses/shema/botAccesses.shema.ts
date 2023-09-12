import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Profile } from '../../profiles/schema/profile.schema';
import Permission from '../types/types';
import { ApiProperty } from '@nestjs/swagger';


@Schema({ timestamps: true }) //Включает поля createdAt и updatedAt
export class BotAccess extends Document {
  @ApiProperty({ example: '64ff89e7faea577804940275' })
  @Prop({
    type: Types.ObjectId,
    ref: 'Profile',
    required: true })
  userId: Profile;


// пока просто строка вместо сущности Bot
 // @ApiProperty({ example: '64ff89e7faea577804940275' })
  // @Prop({
  //   type: Types.ObjectId,
  //   ref: 'Bot',
  //   required: true })
  // botId: Bot;

  @ApiProperty({ example: '64ff89e7faea577804940275' })
  @Prop({
    required: true })
  botId: string;

  @ApiProperty({ enum: [Permission.SUPER_ADMIN, Permission.ADMIN, Permission.USER] })
  @Prop({
    enum: Permission,
    required: true,
    })
  permission: Permission;
}

export const BotAccessSchema = SchemaFactory.createForClass(BotAccess);
