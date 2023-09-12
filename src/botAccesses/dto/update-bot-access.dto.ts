import { IsEnum, IsNotEmpty } from 'class-validator';
import Permission from '../types/types';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateBotAccessDto  {
    @ApiProperty({
        description: 'уровень доступа',
        enum: [Permission.SUPER_ADMIN, Permission.ADMIN, Permission.USER]
    })
    @IsNotEmpty()
    @IsEnum(Permission)
    permission: Permission;
}
