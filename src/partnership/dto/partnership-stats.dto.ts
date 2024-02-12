import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  Matches,
  ValidateNested,
} from 'class-validator';

class WithdrawalRequestDto {
  @ApiProperty({
    example: '2023-01-01T00:00:00.000Z',
    description: 'The date when the withdrawal request was made.',
  })
  @IsDateString()
  requestDate: Date;

  @ApiProperty({
    example: '2023-01-05T00:00:00.000Z',
    description: 'The date when the payment was processed.',
  })
  @IsDateString()
  paymentDate: Date;

  @ApiProperty({
    example: 'Processing',
    enum: ['Paid', 'Processing'],
    description: 'The status of the withdrawal request.',
  })
  @IsEnum({ Paid: 'Paid', Processing: 'Processing' })
  status: 'Paid' | 'Processing';

  @ApiProperty({
    example: 250,
    description: 'The amount of the withdrawal request.',
  })
  @IsNumber()
  amount: number;
}

export class PartnershipMonthlyStatsDto {
  @ApiProperty({ example: '2023-01' })
  @Matches(/^[\d]{4}-[\d]{2}$/, { message: 'month must be in YYYY-MM format' })
  month: string;

  @ApiProperty({ example: 100 })
  @IsNumber({}, { message: 'visits must be a number' })
  visits: number;

  @ApiProperty({ example: 50 })
  @IsNumber({}, { message: 'registrations must be a number' })
  registrations: number;

  @ApiProperty({ example: 25 })
  @IsNumber({}, { message: 'paymentsCount must be a number' })
  paymentsCount: number;

  @ApiProperty({ example: 2500 })
  @IsNumber({}, { message: 'paymentsAmount must be a number' })
  paymentsAmount: number;

  @ApiProperty({ example: 250 })
  @IsNumber({}, { message: 'commissionAmount must be a number' })
  commissionAmount: number;

  @ApiProperty({ example: 2250 })
  @IsNumber({}, { message: 'availableForWithdrawal must be a number' })
  availableForWithdrawal: number;
}

export class PartnershipStatsDto {
  @ApiProperty({ example: 'https://example.com/referral?code=abc123' })
  @IsNotEmpty()
  referralLink: string;

  @ApiProperty({ type: [PartnershipMonthlyStatsDto], isArray: true })
  @ValidateNested({ each: true })
  @Type(() => PartnershipMonthlyStatsDto)
  monthlyStats: PartnershipMonthlyStatsDto[];

  @ApiProperty({ type: [WithdrawalRequestDto], isArray: true })
  @ValidateNested({ each: true })
  @Type(() => WithdrawalRequestDto)
  withdrawalRequests: WithdrawalRequestDto[];
}
