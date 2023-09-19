import { IsBoolean, IsOptional, IsString } from 'class-validator';

export default class UpdateNotificationDto {
  @IsOptional()
  @IsString()
  message?: string;

  @IsOptional()
  @IsBoolean()
  isReceived?: boolean;
}
