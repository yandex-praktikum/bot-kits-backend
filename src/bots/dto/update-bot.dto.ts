import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, ValidateNested } from 'class-validator';
import { UpdateTemplateDto } from './update-template.dto';
import { Messenger } from '../schema/bots.schema';
import { Type } from 'class-transformer';

export class UpdateBotDto extends UpdateTemplateDto {
  @ApiProperty()
  @IsOptional()
  @Type(() => Messenger)
  @ValidateNested()
  messengers?: Messenger[];
}
