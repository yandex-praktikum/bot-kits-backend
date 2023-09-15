import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsPositive, IsString } from 'class-validator';

export class CreatePromocodeDto {
  @ApiProperty({ example: 'PROMO50' })
  @IsNotEmpty()
  @IsString()
  code: string;

  @ApiProperty({ example: '2023-09-10T16:07:34.285Z' })
  @IsNotEmpty()
  actionPeriod: Date;

  @ApiProperty({ example: 2 })
  @IsNotEmpty()
  @IsInt()
  @IsPositive()
  activationCount: number;

  @ApiProperty({ example: 10 })
  @IsNotEmpty()
  @IsInt()
  @IsPositive()
  maxActivationCount: number;
}
