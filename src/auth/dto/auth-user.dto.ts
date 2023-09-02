import { IsUrl, IsNotEmpty } from 'class-validator';

export class AuthUserDto {
  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  email: string;
}
