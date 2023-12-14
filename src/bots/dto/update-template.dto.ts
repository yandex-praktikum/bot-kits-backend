import { ApiProperty } from '@nestjs/swagger';
import {
  IsUrl,
  IsString,
  IsOptional,
  IsObject,
  IsBoolean,
} from 'class-validator';
import { TBuilderData } from '../schema/types/botBuilderTypes';

// update-template.dto.ts
export class UpdateTemplateDto {
  @ApiProperty({
    example:
      'https://cdn.icon-icons.com/icons2/1233/PNG/512/1492718766-vk_83600.png',
  })
  @IsUrl()
  @IsOptional()
  icon?: string;

  @ApiProperty({
    example: 'Бот Автоответчик',
  })
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ example: 'Бот для создания заказов' })
  description?: string;

  @IsOptional()
  @ApiProperty()
  features?: TBuilderData;

  @ApiProperty()
  @IsObject()
  @IsOptional()
  settings?: object;

  @IsBoolean()
  @IsOptional()
  isToPublish?: boolean;
}
