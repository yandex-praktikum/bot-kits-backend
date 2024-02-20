import { ApiProperty } from '@nestjs/swagger';
import {
  IsUrl,
  IsString,
  IsOptional,
  IsObject,
  IsBoolean,
  IsNotEmpty,
} from 'class-validator';
import { TBuilderData } from '../schema/types/botBuilderTypes';

// update-template.dto.ts
export class UpdateTemplateDto {
  @ApiProperty({
    example:
      'https://cdn.icon-icons.com/icons2/1233/PNG/512/1492718766-vk_83600.png',
  })
  @IsOptional()
  @IsNotEmpty()
  icon?: string;

  @ApiProperty({
    example: 'Бот Автоответчик',
  })
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  title?: string;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  @ApiProperty({ example: 'Бот для создания заказов' })
  description?: string;

  @IsOptional()
  @ApiProperty()
  @IsNotEmpty()
  features?: TBuilderData;

  @ApiProperty()
  @IsObject()
  @IsOptional()
  @IsNotEmpty()
  settings?: object;

  @IsBoolean()
  @IsOptional()
  @IsNotEmpty()
  isToPublish?: boolean;
}
