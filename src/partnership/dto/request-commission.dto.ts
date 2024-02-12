import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, Min } from 'class-validator';

export class CreateWithdrawalRequestDto {
  @ApiProperty({
    example: 100,
    description: 'The amount the user wishes to withdraw.',
  })
  @IsNumber()
  @Min(1, { message: 'Amount must be greater than 0.' })
  amount: number;
}
