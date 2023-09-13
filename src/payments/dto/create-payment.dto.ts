import { IsNotEmpty } from 'class-validator';
import TypeOperation from '../types/type-operation';
import { Profile } from 'src/profiles/schema/profile.schema';

export class CreatePaymentDto {
  @IsNotEmpty()
  date: string;

  @IsNotEmpty()
  amount: number;

  @IsNotEmpty()
  successful: boolean;

  @IsNotEmpty()
  operation: TypeOperation;

  @IsNotEmpty()
  profile: Profile;

  note: string;
}
