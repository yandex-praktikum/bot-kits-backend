import { IsNotEmpty } from 'class-validator';

export class CreateTariffDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  price: number;
}
