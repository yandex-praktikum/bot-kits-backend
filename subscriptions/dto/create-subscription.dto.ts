import { IsNotEmpty } from 'class-validator';

export class CreateSubscriptionDto {
  @IsNotEmpty()
  tariffId: string;

  @IsNotEmpty()
  cardMask: string;

  @IsNotEmpty()
  debitDate: Date;
}
