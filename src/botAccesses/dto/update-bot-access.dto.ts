import { IsEnum, IsNotEmpty } from 'class-validator';
import Permission from '../types/types';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateBotAccessDto {
  @ApiProperty({
    description: 'уровень доступа',
    enum: [Permission.OWNER, Permission.LEVEL_1, Permission.LEVEL_2],
  })
  @IsNotEmpty()
  @IsEnum(Permission)
  permission: Permission;
}
