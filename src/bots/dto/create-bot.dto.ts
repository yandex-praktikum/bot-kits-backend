import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, ValidateNested } from 'class-validator';
import { Messenger } from '../schema/bots.schema';
import { Type } from 'class-transformer';
import { CreateTemplateDto } from './create-template.dto';

//create-bot.dto.ts
export class CreateBotDto extends CreateTemplateDto {
  @ApiProperty()
  @IsOptional()
  @Type(() => Messenger)
  @ValidateNested()
  messengers?: Messenger[];
}
