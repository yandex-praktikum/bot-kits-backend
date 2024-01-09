import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import mongoose, { Document, HydratedDocument } from 'mongoose';
import { Platform } from 'src/platforms/schema/platforms.schema';
import { baseSchemaOptions } from 'src/utils/baseSchemaOptions';
import { TAttachments, TMailingSchedule } from './types/mailingTypes';

export type MailingDocument = HydratedDocument<Mailing>;

@Schema(baseSchemaOptions)
export class Mailing extends Document {
  @ApiProperty({ example: 'test' })
  @Prop({ required: true, minlength: 1, maxlength: 255 })
  name: string;

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
  isActibeBotBuilder: boolean;

  @ApiProperty()
  @Prop({ type: Object })
  attachments: TAttachments;

  @ApiProperty()
  @Prop({ type: Object })
  schedule: TMailingSchedule;
}

export const MailingSchema = SchemaFactory.createForClass(Mailing);
