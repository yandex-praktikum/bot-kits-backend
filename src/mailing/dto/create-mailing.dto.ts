import {
  IsString,
  IsObject,
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsDate,
  IsOptional,
  IsUrl,
  Length,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { TButtonBlock } from 'src/bots/schema/types/botBuilderTypes';
import { Platform } from 'src/platforms/schema/platforms.schema';
import { Bot } from 'src/bots/schema/bots.schema';

class scheduleDTO {
  @ApiProperty()
  @IsNotEmpty()
  isNow: boolean;

  @ApiProperty()
  @IsDate()
  @IsOptional()
  date?: Date;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  repeat: string;
}

class FilesDTO {
  @ApiProperty()
  @IsNotEmpty()
  @IsUrl()
  path: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  type: string;
}

class AttachmentDTO {
  @ApiProperty()
  @IsArray()
  @IsOptional()
  files?: FilesDTO[];

  @ApiProperty()
  @IsArray()
  @IsOptional()
  buttons?: TButtonBlock[];
}

export class CreateMailingDTO {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Length(1, 255)
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Length(1, 4096)
  message: string;

  @ApiProperty()
  @IsNotEmpty()
  bot: Bot;

  @ApiProperty()
  @IsNotEmpty()
  platforms: Platform[];

  @ApiProperty()
  @IsObject()
  @IsOptional()
  attachment?: AttachmentDTO;

  @ApiProperty()
  @IsNotEmpty()
  @IsBoolean()
  isActive: boolean;

  @ApiProperty()
  @IsNotEmpty()
  @IsBoolean()
  isActibeBotBuilder: boolean;

  @ApiProperty()
  @IsNotEmpty()
  @IsObject()
  schedule: scheduleDTO;
}
