import { IsNotEmpty, ValidateNested } from 'class-validator';
import { Access } from '../schema/profile.schema';
import { Type } from 'class-transformer';

export class UpdateSharedAccessDto {
  @IsNotEmpty()
  @Type(() => Access)
  @ValidateNested()
  access: Access;
}
