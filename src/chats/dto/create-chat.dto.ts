import { IsNotEmpty, IsString } from 'class-validator';
import { Types } from 'mongoose';

export class CreateChatDto {
  @IsString()
  @IsNotEmpty()
  message: string;

  @IsNotEmpty()
  @IsString()
  sender: Types.ObjectId | string;

  @IsNotEmpty()
  @IsString()
  recipient: Types.ObjectId | string;
}
