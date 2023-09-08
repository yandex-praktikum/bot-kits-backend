import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class FormFields {
  @IsBoolean()
  @IsNotEmpty()
  name: boolean;

  @IsBoolean()
  @IsNotEmpty()
  pages: boolean;

  @IsBoolean()
  @IsNotEmpty()
  accessKey: boolean;

  @IsBoolean()
  @IsNotEmpty()
  url: boolean;
}

export class UpdatePlatformDto {
  @IsUrl()
  @IsOptional()
  icon: string;

  @IsString()
  @IsOptional()
  title: string;

  @ValidateNested()
  @Type(() => FormFields)
  @IsOptional()
  formFields: FormFields;
}
