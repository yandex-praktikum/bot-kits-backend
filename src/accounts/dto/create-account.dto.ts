import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

import TypeAccount from '../types/type-account';
import Role from '../types/role';
import { Types } from 'mongoose';
//create-account.dto.ts
class Credentials {
  @ApiProperty({ example: 'my@mail.ru' })
  @IsEmail(
    {},
    { message: 'Email должен быть действительным адресом электронной почты' },
  )
  @IsNotEmpty({ message: 'Email не может быть пустым' })
  email: string;

  @ApiProperty({ example: 'password123' })
  @IsString()
  @IsNotEmpty({ message: 'Password не может быть пустым' })
  password: string;

  @ApiProperty({ example: 'dkskddksldlslsajsjsdsk,cmksjdksdjskjdk' })
  @IsString()
  @IsOptional()
  accessToken: string;

  @ApiProperty({ example: 'dkskddksldlslsajsjsdsk,cmksjdksdjskjdk' })
  @IsOptional()
  @IsString()
  refreshToken: string;
}

export class CreateAccountDto {
  @ApiProperty({ enum: TypeAccount, example: 'local' })
  @IsEnum(TypeAccount)
  type: TypeAccount;

  @ApiProperty({ enum: Role, example: 'user' })
  @IsOptional()
  @IsEnum(Role)
  role: Role;

  @ApiProperty()
  @Type(() => Credentials)
  @ValidateNested()
  credentials?: Credentials;

  @ApiProperty({ example: '64f9ac26edb84d7ebf6281d0' })
  profile: Types.ObjectId | string;
}
