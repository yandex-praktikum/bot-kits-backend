import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

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

export class UpdateAccountDto {
  @ApiProperty({ enum: TypeAccount, example: 'local' })
  @IsEnum(TypeAccount)
  @IsOptional()
  type?: TypeAccount;

  @ApiProperty({ enum: Role, example: 'admin' })
  @IsOptional()
  @IsEnum(Role)
  role?: Role;

  @ApiProperty()
  @Type(() => Credentials)
  @ValidateNested()
  @IsOptional()
  credentials?: Credentials;
}
