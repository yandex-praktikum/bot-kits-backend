import { IsEmail, IsEnum, IsNotEmpty } from 'class-validator';
import Permission from '../types/types';

export class ShareBotAccessDto {
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsEnum(Permission)
    permission: Permission;
}
