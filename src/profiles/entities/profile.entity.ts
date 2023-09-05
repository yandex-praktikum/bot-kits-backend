import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true }) //Включает поля createdAt и updatedAt
export class Profile extends Document {
  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ required: true })
  password: string;

  @Prop({ unique: true })
  refreshToken: string;

  @Prop()
  phone: string;

  @Prop()
  avatar: string;

  @Prop()
  balance: number;

  @Prop([String])
  promoCodes: string[];

  @Prop()
  subscriptionId: string;
}

export const ProfileSchema = SchemaFactory.createForClass(Profile);
