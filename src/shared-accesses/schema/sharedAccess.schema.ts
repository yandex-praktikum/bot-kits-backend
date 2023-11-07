import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, ValidateNested } from 'class-validator';
import mongoose, { Document, HydratedDocument } from 'mongoose';
import { Profile } from 'src/profiles/schema/profile.schema';
import {
  ISharedAccess,
  sharedAccessDefault,
} from 'src/shared-accesses/types/types';
import { baseSchemaOptions } from 'src/utils/baseSchemaOptions';

export type SharedAccessDocument = HydratedDocument<SharedAccess>;

@Schema(baseSchemaOptions)
export class SharedAccess extends Document {
  @ApiProperty({ example: 'Ivan Ivanov' })
  @Prop({ minlength: 2, maxlength: 30 })
  username: string;

  @ApiProperty({ example: 'test@mail.ru' })
  @IsEmail()
  @Prop()
  email: string;

  @ApiProperty()
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Profile' })
  profile: Profile;

  @ApiProperty({ example: sharedAccessDefault })
  @ValidateNested()
  @Prop({
    default: sharedAccessDefault,
    type: Object,
  })
  permissions: ISharedAccess;
}

export const SharedAccessSchema = SchemaFactory.createForClass(SharedAccess);
