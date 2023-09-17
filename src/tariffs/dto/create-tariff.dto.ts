import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsPositive, IsString } from 'class-validator';

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
}
