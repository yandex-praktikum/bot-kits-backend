import {
  IsBoolean,
  IsNotEmpty,
  IsString,
  IsUrl,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

class FormFields {
  @ApiProperty({ example: true })
  @IsBoolean()
  @IsNotEmpty()
  name: boolean;

  @ApiProperty({ example: true })
  @IsBoolean()
  @IsNotEmpty()
  pages: boolean;

  @ApiProperty({ example: false })
  @IsBoolean()
  @IsNotEmpty()
  accessKey: boolean;

  @ApiProperty({ example: true })
  @IsBoolean()
  @IsNotEmpty()
  url: boolean;
}

export class CreatePlatformDto {
  @ApiProperty({
    example:
      'https://cdn.icon-icons.com/icons2/1233/PNG/512/1492718766-vk_83600.png',
  })
  @IsUrl()
  @IsNotEmpty()
  icon: string;

  @ApiProperty({ example: 'VK' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty()
  @ValidateNested()
  @Type(() => FormFields)
  @IsNotEmpty()
  formFields: FormFields;
}
