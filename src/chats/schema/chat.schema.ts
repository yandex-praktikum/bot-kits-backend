import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Profile } from 'src/profiles/schema/profile.schema';

export type ChatDocument = Document & Chat;
//chat.schema.ts
@Schema()
export class Chat {
  @Prop({ required: true })
  message: string;

  @Prop({ required: true })
  sender: string;

  @Prop({ required: true })
  recipient: string;

  @Prop({ required: true })
  roomId: string;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Profile' })
  profile: Profile;
}

export const ChatSchema = SchemaFactory.createForClass(Chat);

ChatSchema.index({ roomId: 1, createdAt: 1 }); // Индекс по комнате и времени создания
