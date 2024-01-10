import {
  IsString,
  IsObject,
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsDate,
} from 'class-validator';
import { TButtonBlock } from 'src/bots/schema/types/botBuilderTypes';
import { Platform } from 'src/platforms/schema/platforms.schema';
import { Bot } from 'src/bots/schema/bots.schema';

export class CreateMailingDTO {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  bot: Bot;

  @IsNotEmpty()
  platform: Platform;

  @IsObject()
  attachment: AttachmentDTO;

  @IsNotEmpty()
  @IsBoolean()
  isActive: boolean;

  @IsNotEmpty()
  @IsBoolean()
  isActibeBotBuilder: boolean;

  @IsNotEmpty()
  @IsObject()
  schedule: scheduleDTO;
}

class AttachmentDTO {
  @IsArray()
  files: FilesDTO[];

  @IsArray()
  buttons: TButtonBlock[];
}

class FilesDTO {
  @IsNotEmpty()
  @IsString()
  path: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  type: string;
}

class scheduleDTO {
  @IsNotEmpty()
  isNow: boolean;

  @IsDate()
  date: Date;

  @IsNotEmpty()
  @IsString()
  repeat: string;
}
