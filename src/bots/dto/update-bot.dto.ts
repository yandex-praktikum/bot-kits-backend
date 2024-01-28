import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, ValidateNested } from 'class-validator';
import { UpdateTemplateDto } from './update-template.dto';
import { Messenger } from '../schema/bots.schema';
import { Type } from 'class-transformer';
import { Permission } from '../schema/bots.schema';

export class UpdateBotDto extends UpdateTemplateDto {
  @ApiProperty()
  @IsOptional()
  @Type(() => Messenger)
  @ValidateNested()
  @IsNotEmpty()
  messengers?: Messenger[];

  @ApiProperty()
  @Type(() => Permission)
  @ValidateNested()
  @IsNotEmpty()
  permission: Permission;
}
