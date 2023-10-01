import { IsNotEmpty, IsString } from 'class-validator';
import { defaultPermission, TPermission } from '../types/types';
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
    example: defaultPermission,
  })
  @IsNotEmpty()
  permission: TPermission;
}
