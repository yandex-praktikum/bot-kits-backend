import {
  IsBoolean,
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import TypeOperation from '../types/type-operation';
import { Profile } from 'src/profiles/schema/profile.schema';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreatePaymentDto {
  @ApiProperty({ example: '2023-01-03' })
  @Type(() => Date)
  @IsDate()
  @IsNotEmpty()
  date: Date;

  @ApiProperty({ example: '1234' })
  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @ApiProperty({ example: true })
  @IsNotEmpty()
  @IsBoolean()
  successful: boolean;

  @ApiProperty({ enum: TypeOperation, example: 'Поступление' })
  @IsEnum(TypeOperation)
  @IsNotEmpty()
  operation: TypeOperation;

  @ApiProperty({ example: 'Пополнение счета' })
  @IsString()
  note: string;

  @IsOptional()
  profile?: Profile;
}
