import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import Permission from '../types/types';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBotAccessDto {
  @ApiProperty({
    description: `Id бота`,
    example: '64ff94ef12477f1d0934c614',
  })
  @IsNotEmpty()
  @IsString()
  botId: string;

  @ApiProperty({
    description: `уровень доступа`,
    enum: [Permission.OWNER, Permission.LEVEL_1, Permission.LEVEL_2],
  })
  @IsNotEmpty()
  @IsEnum(Permission)
  permission: Permission;
}
