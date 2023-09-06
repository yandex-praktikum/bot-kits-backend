import { IsNumber, IsOptional, IsString, IsUrl, Length } from 'class-validator';

export class CreateProfileDto {
  @IsString()
  @Length(2, 30)
  username: string;

  @IsString()
  phone: string;

  @IsUrl()
  @IsOptional()
  avatar: string;

  @IsNumber()
  @IsOptional()
  balance: number;
}
