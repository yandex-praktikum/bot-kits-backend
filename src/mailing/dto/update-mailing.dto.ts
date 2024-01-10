import { IsNumber, IsOptional } from 'class-validator';
import { PartialType } from '@nestjs/swagger';
import { CreateMailingDTO } from './create-mailing.dto';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateMailingDTO extends PartialType(CreateMailingDTO) {
  @IsNumber()
  @IsOptional()
  @ApiProperty()
  conversion: number;

  @IsNumber()
  @IsOptional()
  @ApiProperty()
  countSuccesesMailing: number;
}
