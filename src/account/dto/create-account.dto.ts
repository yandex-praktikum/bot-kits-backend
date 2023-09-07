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
  email: string;

  @IsString()
  password: string;

  @IsString()
  @IsOptional()
  accessToken: string;

  @IsString()
  @IsOptional()
  refreshToken: string;
}

export class CreateAccountDto {
  @IsEnum(TypeAccount)
  type: TypeAccount;

  @IsOptional()
  @IsEnum(Role)
  role: Role;

  @Type(() => Credentials)
  @ValidateNested()
  credentials: Credentials;

  @IsMongoId()
  profile: string;
}
