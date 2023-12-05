import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, ValidateNested } from 'class-validator';
import { Messenger } from '../schema/bots.schema';
import { Type } from 'class-transformer';
import { CreateTemplateDto } from './create-template.dto';

//create-bot.dto.ts
export class CreateBotDto extends CreateTemplateDto {
  constructor(
    data: Omit<CreateTemplateDto, 'isToPublish'> & {
      messengers?: Messenger[];
    },
  ) {
    super();
    Object.assign(this, data);
  }

  @ApiProperty()
  @IsOptional()
  @Type(() => Messenger)
  @ValidateNested()
  messengers?: Messenger[];
}
