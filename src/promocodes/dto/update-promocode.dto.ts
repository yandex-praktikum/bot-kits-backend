import { PartialType } from '@nestjs/mapped-types';

import { CreatePromocodeDto } from './create-promocode.dto';

export class UpdatePromocodeDto extends PartialType(CreatePromocodeDto) {}
