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
import { Descendant } from 'slate';
import { TButtonBlock } from 'src/bots/schema/types/botBuilderTypes';
import { Platform } from 'src/platforms/schema/platforms.schema';
import { Bot } from 'src/bots/schema/bots.schema';
import { Types } from 'mongoose';

class dateDTO {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  time: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  date: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  timezone?: string;
}

class scheduleDTO {
  @ApiProperty()
  @IsNotEmpty()
  isNow: boolean;

  @ApiProperty()
  @IsOptional()
  date?: dateDTO;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  repeat?: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsBoolean()
  isRepeat: boolean;
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
  message: Descendant[];

  @ApiProperty()
  @IsNotEmpty()
  bot: Types.ObjectId | string;

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
  isActiveBotBuilder: boolean;

  @ApiProperty()
  @IsNotEmpty()
  @IsObject()
  schedule: scheduleDTO;
}
