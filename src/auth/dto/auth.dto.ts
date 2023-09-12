import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import { CreateAccountDto } from 'src/account/dto/create-account.dto';
import { CreateProfileDto } from 'src/profiles/dto/create-profile.dto';

export class AuthDto {
  @ApiProperty({ description: 'Данные профиля', type: CreateProfileDto })
  @Type(() => CreateProfileDto)
  @ValidateNested()
  profileDto: CreateProfileDto;

  @ApiProperty({ description: 'Данные аккаунта', type: CreateAccountDto })
  @Type(() => CreateAccountDto)
  @ValidateNested()
  accountDto: CreateAccountDto;
}
