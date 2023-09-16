import { IsObject, IsOptional, IsString, IsUrl } from 'class-validator';
import { BotTemplate } from '../schema/bot-template.schema';
import { ApiProperty } from '@nestjs/swagger';

export default class UpdateBotTemplateDto implements Partial<BotTemplate> {
  @IsUrl()
  @IsOptional()
  @ApiProperty()
  icon?: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  title?: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  description?: string;

  @IsOptional()
  @ApiProperty()
  features?: string[];

  @IsObject()
  @IsOptional()
  @ApiProperty()
  settings?: object;
}
