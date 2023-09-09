import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { HydratedDocument } from 'mongoose';

export type ProfileDocument = HydratedDocument<Profile>;

@Schema()
export class Profile {
  @ApiProperty({ example: 'Ivan Ivanov' })
  @Prop({ required: true, minlength: 2, maxlength: 30 })
  username: string;

  @ApiProperty({ example: '+79501364578' })
  @Prop({ required: true })
  phone: string;

  @ApiProperty({ example: 'https://i.pravatar.cc/300' })
  @Prop({
    default: 'https://i.pravatar.cc/300',
  })
  avatar: string;

  @ApiProperty({ example: 1400 })
  @Prop({ default: 0 })
  balance: number;

  // Добавить после создание модели с Аккаунтами
  //   @Prop({
  //     type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Account' }],
  //   })
  //   accounts: Account[];
}

export const ProfileSchema = SchemaFactory.createForClass(Profile);
