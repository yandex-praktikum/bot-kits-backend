import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsBoolean } from 'class-validator';
import { HydratedDocument } from 'mongoose';

export type PlatformDocument = HydratedDocument<Platform>;

class FormFields {
  @IsBoolean()
  name: boolean;

  @IsBoolean()
  pages: boolean;

  @IsBoolean()
  accessKey: boolean;

  @IsBoolean()
  url: boolean;
}

@Schema()
export class Platform {
  @Prop({ required: true })
  icon: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true, type: FormFields })
  formFields: FormFields;
}

export const PlatformSchema = SchemaFactory.createForClass(Platform);
