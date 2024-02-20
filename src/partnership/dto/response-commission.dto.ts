import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber } from 'class-validator';

export class WithdrawalResponseDto {
  @ApiProperty({
    example: 'Processing',
    enum: ['Paid', 'Processing'],
    description: 'The status of the withdrawal request.',
  })
  @IsEnum({ Paid: 'Paid', Processing: 'Processing' })
  status: 'Paid' | 'Processing';

  @ApiProperty({
    example: 900,
    description:
      'The remaining available amount for withdrawal after the request.',
  })
  @IsNumber()
  availableForWithdrawal: number;
}
