import { Type } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateSubscriptionDto {
  @IsNotEmpty()
  @IsString()
  cardMask: string;

  @IsNotEmpty()
  @Type(() => Date)
  debitDate: Date;
}
