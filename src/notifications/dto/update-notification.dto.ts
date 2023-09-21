import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export default class UpdateNotificationDto {
  @ApiProperty({ example: 'Изменены настройки бота' })
  @IsOptional()
  @IsString()
  message?: string;

  @ApiProperty({ example: false })
  @IsOptional()
  @IsBoolean()
  isReceived?: boolean;
}
