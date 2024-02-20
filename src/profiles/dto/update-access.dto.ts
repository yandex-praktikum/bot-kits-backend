import { IsNotEmpty, ValidateNested } from 'class-validator';
import { Access } from '../schema/profile.schema';
import { Type } from 'class-transformer';
import { Types } from 'mongoose';

export class UpdateSharedAccessDto {
  @IsNotEmpty()
  profile: string;

  @IsNotEmpty()
  dashboard: boolean;

  @IsNotEmpty()
  botBuilder: boolean;

  @IsNotEmpty()
  mailing: boolean;

  @IsNotEmpty()
  statistics: boolean;
}
