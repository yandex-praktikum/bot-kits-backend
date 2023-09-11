import { IsDate, IsObject, IsOptional, IsString, IsUrl} from "class-validator";
import {BotTemplate} from "../schema/bot-template.schema";
import { ApiProperty } from "@nestjs/swagger";

export default class BotTemplateDto implements Partial<BotTemplate> {
    @IsString()
    @IsOptional()
    @ApiProperty({
        example:
          '1',
    })
    _id: string

    @IsUrl()
    @IsOptional()
    @ApiProperty()
    icon: string;

    @IsString()
    @IsOptional()
    @ApiProperty()
    title: string;

    @IsString()
    @IsOptional()
    @ApiProperty()
    description: string;

    @IsOptional()
    @ApiProperty()
    features: string[]

    @IsObject()
    @IsOptional()
    @ApiProperty()
    settings: Object

    @IsDate()
    @IsOptional()
    @ApiProperty()
    createdAt: Date
    @IsDate()
    @IsOptional()
    @ApiProperty()
    updatedAt: Date
}
