import { IsEnum, IsNotEmpty } from 'class-validator';
import Permission from '../types/types';

export class CreateBotAccessDto {
  @IsNotEmpty()
  botId: string;

  @IsNotEmpty()
  @IsEnum(Permission)
  permission: Permission;
}
