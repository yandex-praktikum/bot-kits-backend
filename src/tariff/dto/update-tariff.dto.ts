import { IsInt, IsOptional, IsPositive, IsString } from 'class-validator';
import { CreateTariffDto } from './create-tariff.dto';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateTariffDto extends CreateTariffDto {
  @ApiProperty({ example: 'Новый старт!' })
  @IsOptional()
  @IsString()
  name: string;

  @ApiProperty({ example: 490 })
  @IsOptional()
  @IsInt()
  @IsPositive()
  price: number;
}
