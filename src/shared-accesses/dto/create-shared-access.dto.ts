import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

import { ISharedAccess, sharedAccessDefault } from '../types/types';
import { Types } from 'mongoose';

export class CreateSharedAccessDto {
  @ApiProperty({
    description: `Id аккаунта`,
    example: '64ff94ef12477f1d0934c614',
  })
  @IsNotEmpty()
  @IsString()
  profile: Types.ObjectId | string;

  @ApiProperty({
    description: `имя`,
    example: 'Ivan',
  })
  @IsNotEmpty()
  @IsString()
  username: string;

  @ApiProperty({
    description: `email`,
    example: 'test@mail.ru',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    description: `уровень доступа`,
    example: sharedAccessDefault,
  })
  @IsNotEmpty()
  @IsOptional()
  permissions?: ISharedAccess;
}
