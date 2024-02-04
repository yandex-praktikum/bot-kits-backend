import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
  Min,
} from 'class-validator';
import { IsNotNaN } from 'src/utils/class-validator/isNotNaN';

export class CreateTariffDto {
  @ApiProperty({ example: 'Старт' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: 390 })
  @IsNotEmpty()
  @IsInt()
  @Min(0)
  @IsNotNaN()
  price: number;

  @IsNotEmpty()
  @IsInt()
  @IsPositive()
  @IsNotNaN()
  botsCount: number;

  @IsNotEmpty()
  @IsInt()
  @IsPositive()
  @IsNotNaN()
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

  @IsNotEmpty()
  @IsBoolean()
  @IsOptional()
  isDemo?: boolean;
}
