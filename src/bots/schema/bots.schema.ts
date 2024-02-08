import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, HydratedDocument } from 'mongoose';
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { Profile } from '../../profiles/schema/profile.schema';
import { baseSchemaOptions } from 'src/utils/baseSchemaOptions';
import { TypeCommands, botCommands } from '../dto/constants/botCommands';
import { TBuilderData } from './types/botBuilderTypes';

//bots.schema.ts
export type BotDocument = HydratedDocument<Bot>;

export class Messenger {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsArray()
  @IsOptional()
  pages?: string[];

  @IsString()
  @IsOptional()
  accessKey?: string;

  @IsString()
  @IsOptional()
  url?: string;
}

export class Permission {
  @IsNotEmpty()
  @IsBoolean()
  dashboard: boolean;

  @IsNotEmpty()
  @IsBoolean()
  botBuilder: boolean;

  @IsNotEmpty()
  @IsBoolean()
  mailing: boolean;

  @IsNotEmpty()
  @IsBoolean()
  static: boolean;
}

@Schema(baseSchemaOptions)
export class Bot extends Document {
  @Prop({
    required: true,
    enum: ['template', 'custom'],
  })
  type: 'template' | 'custom';

  @Prop()
  icon?: string;

  @Prop({
    unique: true,
    minlength: 2,
    maxlength: 100,
  })
  title: string;

  @Prop({ default: 'none' })
  description?: string;

  @Prop({ type: Object })
  features?: TBuilderData;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Profile',
  })
  profile?: Profile;

  @Prop([Messenger])
  messengers?: Messenger[];

  @Prop({ type: Object })
  settings?: object;

  @Prop({
    type: [String],
    enum: Object.values(TypeCommands),
    default: botCommands,
  })
  commands?: TypeCommands[];

  @Prop({ default: false })
  isToPublish?: boolean;

  @Prop({
    type: Permission,
    default: () => ({
      dashboard: true,
      botBuilder: true,
      mailing: true,
      static: true,
    }),
  })
  permission: Permission;
}

export const BotSchema = SchemaFactory.createForClass(Bot);
BotSchema.index({ title: 1, profile: 1 }, { unique: true });
