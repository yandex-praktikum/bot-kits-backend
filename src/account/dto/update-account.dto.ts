import {
  IsEmail,
  IsEnum,
  IsMongoId,
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
  email: string;

  @IsString()
  @IsOptional()
  password: string;

  @IsString()
  @IsOptional()
  accessToken: string;

  @IsString()
  @IsOptional()
  refreshToken: string;
}

export class UpdateAccountDto {
  @IsOptional()
  @IsEnum(TypeAccount)
  type: TypeAccount;

  @IsOptional()
  @IsEnum(Role)
  role: Role;

  @IsOptional()
  @Type(() => Credentials)
  @ValidateNested()
  credentials: Credentials;

  @IsOptional()
  @IsMongoId()
  profile: string;
}
