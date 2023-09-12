import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import mongoose, { HydratedDocument } from 'mongoose';
import { Profile } from 'src/profiles/schema/profile.schema';

export type SubscriptionDocument = HydratedDocument<Subscription>;

@Schema({ timestamps: true })
export class Subscription {
  @ApiProperty({ example: '111111111' })
  @Prop({ required: true })
  tariffId: string;

  @ApiProperty({ example: true, default: false })
  @Prop({ required: true, default: false })
  status: boolean;

  @ApiProperty({ example: '4500 *** 1119' })
  @Prop()
  cardMask: string;

  @ApiProperty({ example: new Date() })
  @Prop({ default: new Date(), required: true })
  debitDate: Date;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Profile',
    unique: true,
    required: true,
  })
  profile: Profile;
}

export const SubscriptionSchema = SchemaFactory.createForClass(Subscription);
