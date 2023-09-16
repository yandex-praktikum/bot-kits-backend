import { ApiProperty } from '@nestjs/swagger';
import {
  IsMongoId,
  IsNotEmpty,
  IsObject,
  IsString,
  IsUrl,
  ValidateNested,
} from 'class-validator';
import { Types } from 'mongoose';
import { Messenger } from '../schema/bots.schema';
import { Type } from 'class-transformer';

export class CreateBotDto {
  @ApiProperty({
    example:
      'https://cdn.icon-icons.com/icons2/1233/PNG/512/1492718766-vk_83600.png',
  })
  @IsUrl()
  @IsNotEmpty()
  icon: string;

  @ApiProperty({
    example: 'Бот Автоответчик',
  })
  @IsString()
  @IsNotEmpty()
  botName: string;

  @ApiProperty({ example: '64f9ac26edb84d7ebf6281d0' })
  @IsMongoId()
  @IsNotEmpty()
  profile: Types.ObjectId;

  @ApiProperty()
  @Type(() => Messenger)
  @ValidateNested()
  messenger: Messenger;

  @ApiProperty()
  @IsObject()
  botSettings: object;
}
