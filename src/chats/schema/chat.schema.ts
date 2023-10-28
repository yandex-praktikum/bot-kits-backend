import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument } from 'mongoose';
import { baseSchemaOptions } from 'src/utils/baseSchemaOptions';

export type ChatDocument = HydratedDocument<Chat>;

@Schema(baseSchemaOptions)
export class Chat extends Document {
  @Prop({ required: true })
  message: string;

  @Prop({ required: true })
  sender: string;

  @Prop({ required: true })
  recipient: string;
}

export const ChatSchema = SchemaFactory.createForClass(Chat);

ChatSchema.index({ sender: 1, recipient: 1 });
