import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import { CreateAccountDto } from 'src/accounts/dto/create-account.dto';
import { CreateProfileDto } from 'src/profiles/dto/create-profile.dto';
//auth.dto.ts
export class AuthDto {
  @ApiProperty({ description: 'Данные профиля', type: CreateProfileDto })
  @Type(() => CreateProfileDto)
  @ValidateNested()
  profileData: CreateProfileDto;

  @ApiProperty({ description: 'Данные аккаунта', type: CreateAccountDto })
  @Type(() => CreateAccountDto)
  @ValidateNested()
  accountData: CreateAccountDto;
}