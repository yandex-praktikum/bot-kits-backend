import { IsNotEmpty } from 'class-validator';

export class UpdateSharedAccessDto {
  @IsNotEmpty()
  profile: string;

  @IsNotEmpty()
  dashboard: boolean;

  @IsNotEmpty()
  botBuilder: boolean;

  @IsNotEmpty()
  mailing: boolean;

  @IsNotEmpty()
  statistics: boolean;
}
