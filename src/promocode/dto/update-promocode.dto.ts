import { PartialType } from '@nestjs/swagger';
import { CreatePromocodeDto } from './create-promocode.dto';

export class UpdatePromocodeDto extends PartialType(CreatePromocodeDto) {}
