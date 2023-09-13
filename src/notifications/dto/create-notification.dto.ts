import { IsBoolean, IsDate, IsNotEmpty } from 'class-validator';
import { FromWhom } from '../entities/fromWhom.schema';
import { ToWhom } from '../entities/toWhom.schema';

export class CreateNotificationDto {
  @IsNotEmpty()
  fromWhom: FromWhom;

  @IsNotEmpty()
  toWhom: ToWhom;

  @IsNotEmpty()
  message: object;

  @IsNotEmpty()
  @IsBoolean()
  isReceived: boolean;

  @IsNotEmpty()
  @IsDate()
  created_at: Date;

  @IsNotEmpty()
  @IsDate()
  updated_at: Date;
}
