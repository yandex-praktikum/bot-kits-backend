import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Profile } from '../../profiles/schema/profile.schema';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

class WithdrawalRequestDto {
  @ApiProperty()
  requestDate: Date;

  @ApiProperty()
  paymentDate: Date;

  @ApiProperty()
  status: 'Paid' | 'Processing';

  @ApiProperty()
  amount: number;
}

@Schema()
export class Partnership extends Document {
  @Prop({ required: true, type: Types.ObjectId, ref: 'Profile' })
  profile: Types.ObjectId | Profile;

  @ApiProperty({ example: '0000000' })
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @Prop({ required: true })
  partner_ref: string;

  @ApiProperty({ example: 0 })
  @Prop([{ timestamp: Date }])
  visited_ref: { timestamp: Date }[];

  @ApiProperty({ example: 0 })
  @Prop([{ profileId: Types.ObjectId, timestamp: Date, paymentAmount: Number }])
  registration_ref: {
    profileId: Types.ObjectId;
    timestamp: Date;
    paymentAmount: number;
  }[];

  @Prop([
    {
      month: String,
      visits: Number,
      registrations: Number,
      paymentsCount: Number,
      paymentsAmount: Number,
      commissionAmount: Number,
      availableForWithdrawal: Number,
    },
  ])
  monthlyStats: {
    month: string;
    visits: number;
    registrations: number;
    paymentsCount: number;
    paymentsAmount: number;
    commissionAmount: number;
    availableForWithdrawal: number;
  }[];

  @ApiProperty({ type: [WithdrawalRequestDto] })
  withdrawalRequests: WithdrawalRequestDto[];
}

export const PartnershipSchema = SchemaFactory.createForClass(Partnership);
export type PartnershipDocument = Partnership & Document;
