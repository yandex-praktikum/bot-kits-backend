import { IsOptional } from 'class-validator';
import { CreateTariffDto } from './tariff.dto';

export class UpdateTariffDto extends CreateTariffDto {
  @IsOptional()
  name: string;

  @IsOptional()
  price: number;
}
