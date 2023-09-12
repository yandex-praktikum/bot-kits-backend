import { IsNotEmpty } from 'class-validator';
import { Profile } from 'src/profiles/schema/profile.schema';

export class CreateSubscriptionDto {
  @IsNotEmpty()
  tariffId: string;

  @IsNotEmpty()
  cardMask: string;

  @IsNotEmpty()
  debitDate: Date;

  @IsNotEmpty()
  profile: Profile;
}
