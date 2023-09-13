import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document } from 'mongoose';

@Schema({ timestamps: true }) //Включает поля createdAt и updatedAt
export class Tariff extends Document {
  @ApiProperty({ example: 'Старт' })
  @Prop({ required: true, unique: true })
  name: string;

  @ApiProperty({ example: 390 })
  @Prop({ required: true })
  price: number;

  @ApiProperty({ example: '2023-09-10T16:07:34.285Z', required: false })
  @Prop({ default: Date.now })
  createdAt: Date;

  @ApiProperty({ example: '2023-09-10T16:07:34.285Z', required: false })
  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const TariffSchema = SchemaFactory.createForClass(Tariff);
