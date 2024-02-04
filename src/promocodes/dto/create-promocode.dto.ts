import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsPositive,
  IsString,
  Min,
} from 'class-validator';

export class CreatePromocodeDto {
  @ApiProperty({ example: 'PROMO50' })
  @IsNotEmpty()
  @IsString()
  code: string;

  @ApiProperty({ example: '2023-09-10T16:07:34.285Z' })
  @IsNotEmpty()
  @IsDateString()
  actionPeriod: Date;

  @ApiProperty({ example: 2 })
  @IsNotEmpty()
  @IsInt()
  @Min(0)
  activationCount: number;

  @ApiProperty({ example: 10 })
  @IsNotEmpty()
  @IsInt()
  @IsPositive()
  maxActivationCount: number;

  @ApiProperty({ example: 1500 })
  @IsNotEmpty()
  @IsInt()
  @IsPositive()
  amount: number;

  @ApiProperty({ example: 1500 })
  @IsNotEmpty()
  @IsBoolean()
  status: boolean;
}
