import { IsEmail, IsNotEmpty } from 'class-validator';
import { defaultPermission, TPermission } from '../types/types';
import { ApiProperty } from '@nestjs/swagger';

export class ShareBotAccessDto {
  @ApiProperty({
    description: 'Email зарегистрированного пользователя',
    example: 'test@test.ru',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'уровень доступа',
    example: defaultPermission,
  })
  @IsNotEmpty()
  permission: TPermission;
}
