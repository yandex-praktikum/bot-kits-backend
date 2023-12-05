import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayNotEmpty,
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  Length,
} from 'class-validator';
import { Types } from 'mongoose';
import { Account } from 'src/accounts/schema/account.schema';
//create-profile.dto.ts
export class CreateProfileDto {
  @ApiProperty({ example: 'Ivan Ivanov' })
  @IsString()
  @IsNotEmpty({ message: 'Username не может быть пустым' })
  @Length(2, 30, {
    message: 'Длинная username должна быть от 2 до 30 символов',
  })
  username: string;

  @ApiProperty({ example: '+79501364578' })
  @IsNotEmpty({ message: 'Phone не может быть пустым' })
  @IsString()
  phone: string;

  @ApiProperty({ example: 'https://i.pravatar.cc/300', required: false })
  @IsUrl({}, { message: 'Avatar должен быть действительным URL' })
  @IsOptional()
  avatar?: string;

  @ApiProperty({ example: 1400 })
  @IsNumber({}, { message: 'Баланс должен быть числом' })
  @IsOptional()
  balance?: number;

  @ApiProperty({ required: false })
  @IsArray()
  @ArrayNotEmpty({ message: 'Аккаунтов не может быть 0' })
  accounts: Account[];

  @IsOptional()
  @ApiProperty({ example: '64f9ac26edb84d7ebf6281d0' })
  sharedAccess?: Types.ObjectId | string;

  @ApiProperty({ example: '0000000' })
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  partner_ref?: string;

  @ApiProperty({ example: 0 })
  @IsNumber()
  visited_ref?: number;

  @ApiProperty({ example: 0 })
  @IsNumber()
  registration_ref?: number;
}
