import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class ShareBotDto {
  @ApiProperty({
    description: 'Email зарегистрированного пользователя',
    example: 'test@test.ru',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;
}
