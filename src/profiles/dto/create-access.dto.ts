import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class CreateSharedAccessDto {
  @ApiProperty({
    description: `email`,
    example: 'test@mail.ru',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;
}
