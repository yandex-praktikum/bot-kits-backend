import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put
} from "@nestjs/common";
import { ApiBody, ApiCreatedResponse, ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";
import {BotTemplatesService} from "./bot-templates.service";
import {BotTemplate} from "./schema/bot-template.schema";
import BotTemplateDto from "./dto/bot-template.dto";

@ApiTags('botTemplates')
@Controller('botTemplates')
export class BotTemplatesController {
  constructor(private readonly botTemplatesService: BotTemplatesService) { }

  @ApiOperation({
    summary: 'Список шаблонов ботов',
  })
  @Get()
  async findAll(): Promise<BotTemplate[]>{
    return await this.botTemplatesService.findAll();
  }

  @ApiOperation({
    summary: 'Данные шаблона бота',
  })
  @ApiParam({
    name: 'id',
    description: 'Индификатор платформы',
    example: '64f81ba37571bfaac18a857f',
  })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.botTemplatesService.findById(id);
  }

  @ApiOperation({
    summary: 'Создать шаблон бота',
  })
  @ApiBody({ type:  BotTemplateDto})
  @ApiCreatedResponse({
    description: 'The record has been successfully created.',
    type: BotTemplateDto,
  })
  @Post()
  async create(@Body() updateDtoRequest: BotTemplateDto) {
    return await this.botTemplatesService.create(updateDtoRequest);
  }

  @ApiOperation({
    summary: 'Изменить шаблон бота',
  })
  @ApiBody({ type:  BotTemplateDto})
  @ApiCreatedResponse({
    description: 'The record has been updated created.',
    type: BotTemplateDto,
  })
  @ApiParam({
    name: 'id',
    description: 'Индификатор платформы',
    example: '64f81ba37571bfaac18a857f',
  })
  @Put(':id')
  update(@Body() updateDtoRequest:BotTemplateDto, @Param('id') id: string) {
    return this.botTemplatesService.update(id, updateDtoRequest);
  }
}
