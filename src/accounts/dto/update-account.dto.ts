import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

import TypeAccount from '../types/type-account';
import Role from '../types/role';

class Credentials {
  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  password?: string;

  @IsString()
  @IsOptional()
  accessToken?: string;

  @IsString()
  @IsOptional()
  refreshToken?: string;
}

export class UpdateAccountDto {
  @IsEnum(TypeAccount)
  @IsOptional()
  type?: TypeAccount;

  @IsOptional()
  @IsEnum(Role)
  role?: Role;

  @Type(() => Credentials)
  @ValidateNested()
  @IsOptional()
  credentials?: Credentials;
}
