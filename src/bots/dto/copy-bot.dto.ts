import { ApiProperty } from '@nestjs/swagger';
import { ValidateNested } from 'class-validator';
import { Messenger } from '../schema/bots.schema';
import { Type } from 'class-transformer';

export class CopyBotDto {
  @ApiProperty()
  @Type(() => Messenger)
  @ValidateNested()
  messenger: Messenger;
}
