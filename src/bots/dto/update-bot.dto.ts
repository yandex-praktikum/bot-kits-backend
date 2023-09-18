import { ApiProperty } from '@nestjs/swagger';
import { IsObject, IsString, IsUrl } from 'class-validator';

export class UpdateBotDto {
  @ApiProperty({
    example:
      'https://cdn.icon-icons.com/icons2/1233/PNG/512/1492718766-vk_83600.png',
  })
  @IsUrl()
  icon?: string;

  @ApiProperty({
    example: 'Бот Автоответчик',
  })
  @IsString()
  botName?: string;

  @ApiProperty()
  @IsObject()
  botSettings?: {};
}
