import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
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

  @ApiProperty({ example: true })
  @IsBoolean()
  @IsNotEmpty()
  accessKey: boolean;

  @ApiProperty({ example: false })
  @IsBoolean()
  @IsNotEmpty()
  url: boolean;
}

export class UpdatePlatformDto {
  @ApiProperty({
    example:
      'https://cdn.icon-icons.com/icons2/1233/PNG/512/1492718766-vk_83600.png',
  })
  @IsUrl()
  @IsOptional()
  icon?: string;

  @ApiProperty({ example: 'VK' })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiProperty()
  @ValidateNested()
  @Type(() => FormFields)
  @IsOptional()
  formFields?: FormFields;
}
