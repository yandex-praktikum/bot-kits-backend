import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import mongoose, { Document, HydratedDocument } from 'mongoose';
import { Platform } from 'src/platforms/schema/platforms.schema';
import { baseSchemaOptions } from 'src/utils/baseSchemaOptions';
import { TAttachment, TMailingSchedule } from './types/mailingTypes';
import { Descendant } from 'slate';
import { Bot } from 'src/bots/schema/bots.schema';

export type MailingDocument = HydratedDocument<Mailing>;

@Schema(baseSchemaOptions)
export class Mailing extends Document {
  @ApiProperty({ example: 'test' })
  @Prop({ required: true, minlength: 1, maxlength: 255 })
  name: string;

  @ApiProperty({ example: 'mailing message' })
  @Prop({ required: true })
  message: Descendant[];

  @ApiProperty()
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Bot' })
  bot: Bot;

  @ApiProperty()
  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Platform' }] })
  platforms: Platform[];

  @ApiProperty()
  @Prop({ default: 0 })
  countSuccesesMailing: number;

  @ApiProperty()
  @Prop({ default: 0 })
  conversion: number;

  @ApiProperty()
  @Prop({ required: true })
  isActive: boolean;

  @ApiProperty()
  @Prop({ required: true })
  isActiveBotBuilder: boolean;

  @ApiProperty()
  @Prop({ type: Object })
  attachment: TAttachment;

  @ApiProperty()
  @Prop({ type: Object, required: true })
  schedule: TMailingSchedule;
}

export const MailingSchema = SchemaFactory.createForClass(Mailing);
