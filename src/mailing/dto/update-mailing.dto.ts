import { IsNumber } from 'class-validator';
import { PartialType } from '@nestjs/swagger';
import { CreateMailingDTO } from './create-mailing.dto';

export class UpdateMailingDTO extends PartialType(CreateMailingDTO) {
  @IsNumber()
  conversion: number;

  @IsNumber()
  countSuccesesMailing: number;
}
