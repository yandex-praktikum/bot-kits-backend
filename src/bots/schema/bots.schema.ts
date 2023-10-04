import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {ApiProperty} from '@nestjs/swagger';
import mongoose, {Document, HydratedDocument} from 'mongoose';
import {IsArray, IsNotEmpty, IsOptional, IsString} from 'class-validator';
import {Profile} from '../../profiles/schema/profile.schema';
import {baseSchemaOptions} from 'src/utils/baseSchemaOptions';
import {TypeCommands} from "../types/typeCommands";

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

@Schema(baseSchemaOptions)
export class Bot extends Document {
  @Prop({
    default: false,
    required: true,
  })
  isTemplate: boolean;

  @Prop()
  icon?: string;

  @Prop({
    required: true,
    minlength: 2,
    maxlength: 30,
  })
  title: string;

  @Prop({ default: 'none' })
  description?: string;

  @Prop([String])
  features: string[];

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Profile',
  })
  profile?: Profile;

  @Prop({
    type: Messenger,
  })
  messenger?: Messenger;

  @ApiProperty({
    example: {
      Приветствие: 'Я бот-автоответчик',
      Инлайн_кнопка: 'Текст кнопки',
    },
  })
  @Prop({ type: Object })
  settings?: object;
}

export const BotSchema = SchemaFactory.createForClass(Bot);
