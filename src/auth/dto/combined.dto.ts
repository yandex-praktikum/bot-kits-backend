// combined.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';

export class CombinedDto {
  @ApiProperty({ required: true, example: 'my@mail.ru' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ required: true, example: 'password123' })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({ required: true, example: 'Ivan Ivanov' })
  @IsNotEmpty()
  @IsString()
  username: string;

  @ApiProperty({ required: true, example: '+79501364578' })
  @IsNotEmpty()
  @IsString()
  phone: string;

  @ApiProperty({ example: 'https://i.pravatar.cc/300', required: false })
  @IsUrl()
  @IsOptional()
  avatar?: string;
}
