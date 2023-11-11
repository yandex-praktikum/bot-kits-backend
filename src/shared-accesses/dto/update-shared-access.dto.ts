import { OmitType } from '@nestjs/mapped-types';
import { CreateSharedAccessDto } from './create-shared-access.dto';

export class UpdateSharedAccessDto extends OmitType(CreateSharedAccessDto, [
  'profile',
]) {}
