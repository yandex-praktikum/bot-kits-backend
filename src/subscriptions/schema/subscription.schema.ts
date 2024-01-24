import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import mongoose, { HydratedDocument } from 'mongoose';
import { Profile } from 'src/profiles/schema/profile.schema';
import { Tariff } from 'src/tariffs/schema/tariff.schema';
import { baseSchemaOptions } from 'src/utils/baseSchemaOptions';

export type SubscriptionDocument = HydratedDocument<Subscription>;

@Schema(baseSchemaOptions)
export class Subscription {
  @Prop({ type: mongoose.Schema.Types.Mixed })
  tariff: Tariff;

  @ApiProperty({ example: true, default: false })
  @Prop({ required: true, default: false })
  status: boolean;

  @ApiProperty({ example: '4500 *** 1119' })
  @Prop()
  cardMask: string;

  @ApiProperty({ example: new Date() })
  @Prop({ default: new Date(), required: true })
  debitDate: Date;

  @Prop({ type: mongoose.Schema.Types.Mixed })
  profile: Profile;

  @Prop({ type: mongoose.Schema.Types.Mixed })
  updatingTariff: Tariff;

  @ApiProperty({ example: false, default: false })
  @Prop({ required: true, default: false })
  isCancelled: boolean; // Флаг отмены подписки
}

export const SubscriptionSchema = SchemaFactory.createForClass(Subscription);
