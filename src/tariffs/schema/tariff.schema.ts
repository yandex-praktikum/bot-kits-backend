import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document, HydratedDocument } from 'mongoose';
import { baseSchemaOptions } from 'src/utils/baseSchemaOptions';

export type TariffDocument = HydratedDocument<Tariff>;

@Schema(baseSchemaOptions) //Включает поля createdAt и updatedAt
export class Tariff extends Document {
  @ApiProperty({ example: 'Старт' })
  @Prop({ required: true, unique: true })
  name: string;

  @ApiProperty({ example: 390 })
  @Prop({ required: true })
  price: number;

  @ApiProperty({ example: 100 })
  @Prop({ required: true })
  botsCount: number;

  @ApiProperty({ example: 2120 })
  @Prop({ required: true })
  subscribersCount: number;

  @ApiProperty({ example: '1M' })
  @Prop({ required: true })
  duration: string;

  @ApiProperty({ example: 'Активен' })
  @Prop({ required: true })
  status: boolean;

  @Prop({ required: true, default: false })
  isStarted: boolean;

  @Prop({ default: false })
  isDemo: boolean;
}

export const TariffSchema = SchemaFactory.createForClass(Tariff);
