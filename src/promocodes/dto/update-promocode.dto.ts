import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreatePromocodeDto } from './create-promocode.dto';
import {
  IsString,
  IsInt,
  IsPositive,
  IsOptional,
  Min,
  IsDateString,
} from 'class-validator';

export class UpdatePromocodeDto extends PartialType(CreatePromocodeDto) {
  @ApiProperty({ example: 'PROMO100' })
  @IsOptional()
  @IsString()
  code: string;

  @ApiProperty({ example: '2024-12-10T00:00:00.285Z' })
  @IsOptional()
  @IsDateString()
  actionPeriod: Date;

  @ApiProperty({ example: 2 })
  @IsOptional()
  @IsInt()
  @Min(0)
  activationCount: number;

  @ApiProperty({ example: 10 })
  @IsOptional()
  @IsInt()
  @IsPositive()
  maxActivationCount: number;

  @ApiProperty({ example: 1500 })
  @IsOptional()
  @IsInt()
  @IsPositive()
  amount: number;
}
