import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import { CreateAccountDto } from 'src/account/dto/create-account.dto';
import { CreateProfileDto } from 'src/profiles/dto/create-profile.dto';

//auth.dto.ts
export class AuthDto {
  @ApiProperty()
  @Type(() => CreateProfileDto)
  @ValidateNested()
  profileDto: CreateProfileDto;

  @ApiProperty()
  @Type(() => CreateAccountDto)
  @ValidateNested()
  accountDto: CreateAccountDto;
}
