import { IsEnum, IsNotEmpty } from 'class-validator';
import Permission from '../types/types';

export class UpdateBotAccessDto  {
    @IsNotEmpty()
    @IsEnum(Permission)
    permission: Permission;
}
