import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true }) //Включает поля createdAt и updatedAt
export class Tariff extends Document {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ required: true })
  price: number;

  @Prop()
  created_at: string;

  @Prop()
  updated_at: string;
}

export const TariffSchema = SchemaFactory.createForClass(Tariff);
