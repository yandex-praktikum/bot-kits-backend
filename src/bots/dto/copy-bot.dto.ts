import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, ValidateNested } from 'class-validator';
import { Messenger } from '../schema/bots.schema';
import { Type } from 'class-transformer';

export class CopyBotDto {
  @ApiProperty()
  @Type(() => Messenger)
  @ValidateNested()
  @IsOptional()
  messengers?: Messenger[];
}
