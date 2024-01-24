import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import mongoose, { HydratedDocument } from 'mongoose';
import { Profile } from 'src/profiles/schema/profile.schema';
import TypeOperation from '../types/type-operation';
import { baseSchemaOptions } from 'src/utils/baseSchemaOptions';
import { Tariff } from 'src/tariffs/schema/tariff.schema';
import { Promocode } from 'src/promocodes/schema/promocode.schema';

export type PaymentDocument = HydratedDocument<Payment>;

@Schema(baseSchemaOptions)
export class Payment {
  @ApiProperty({ example: new Date() })
  @Prop({ required: true, unique: true })
  date: Date;

  @ApiProperty({ example: 1000 })
  @Prop({ required: true })
  amount: number;

  @ApiProperty({ example: true })
  @Prop({ required: true })
  successful: boolean;

  @ApiProperty({ enum: TypeOperation, example: 'Поступление' })
  @Prop({ required: true, enum: TypeOperation, type: String })
  operation: TypeOperation;

  @ApiProperty({ example: 'Пополнение счета', default: '-' })
  @Prop({ default: '-' })
  note: string;

  @Prop({
    type: Profile,
    required: true,
  })
  profile: Profile;

  @Prop({ type: mongoose.Schema.Types.Mixed })
  tariff: Tariff;

  @Prop({ type: mongoose.Schema.Types.Mixed })
  promocode: Promocode;
}

export const PaymentSchema = SchemaFactory.createForClass(Payment);
