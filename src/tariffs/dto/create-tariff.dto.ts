import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsPositive,
  IsString,
} from 'class-validator';

export class CreateTariffDto {
  @ApiProperty({ example: 'Старт' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: 390 })
  @IsNotEmpty()
  @IsInt()
  @IsPositive()
  price: number;

  @IsNotEmpty()
  @IsInt()
  @IsPositive()
  botsCount: number;

  @IsNotEmpty()
  @IsInt()
  @IsPositive()
  subscribersCount: number;

  @IsNotEmpty()
  @IsString()
  duration: string;

  @IsNotEmpty()
  @IsBoolean()
  status: boolean;

  @IsNotEmpty()
  @IsBoolean()
  isStarted: boolean;
}
