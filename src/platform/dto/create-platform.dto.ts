import {
  IsBoolean,
  IsNotEmpty,
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

export class CreatePlatformDto {
  @IsUrl()
  @IsNotEmpty()
  icon: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @ValidateNested()
  @Type(() => FormFields)
  @IsNotEmpty()
  formFields: FormFields;
}
