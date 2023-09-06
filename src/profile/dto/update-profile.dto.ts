import { IsNumber, IsOptional, IsString, IsUrl, Length } from 'class-validator';

export class UpdateProfileDto {
  @IsString()
  @Length(2, 30)
  @IsOptional()
  username: string;

  @IsString()
  @IsOptional()
  phone: string;

  @IsUrl()
  @IsOptional()
  avatar: string;

  @IsNumber()
  @IsOptional()
  balance: number;
}
