import { IsNotEmpty } from 'class-validator';
import { Permission } from '../types/types';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateBotAccessDto {
  @ApiProperty({
    description: 'уровень доступа',
  })
  @IsNotEmpty()
  permission: Permission;
}
