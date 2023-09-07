import {
  IsEmail,
  IsEnum,
  IsMongoId,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

import TypeAccount from '../types/type-account';
import Role from '../types/role';

class Credentials {
  @ApiProperty({ example: 'my@mail.ru' })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty({ example: 'password123' })
  @IsString()
  @IsOptional()
  password?: string;

  @ApiProperty({ example: 'dkskddksldlslsajsjsdsk,cmksjdksdjskjdk' })
  @IsString()
  @IsOptional()
  accessToken?: string;

  @ApiProperty({ example: 'dkskddksldlslsajsjsdsk,cmksjdksdjskjdk' })
  @IsString()
  @IsOptional()
  refreshToken?: string;
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
  @IsMongoId()
  profile: string;
}
