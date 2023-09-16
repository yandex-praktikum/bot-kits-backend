import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import { BotTemplatesService } from './bot-templates.service';
import { BotTemplate } from './schema/bot-template.schema';
import UpdateBotTemplateDto from './dto/update.bot-template.dto';
import CreateBotTemplateDto from './dto/create.bot-template.dto';

@ApiTags('botTemplates')
@Controller('botTemplates')
export class BotTemplatesController {
  constructor(private readonly botTemplatesService: BotTemplatesService) {}

  @ApiOkResponse({
    description: 'The resources were returned successfully',
    type: [BotTemplate],
  })
  @ApiForbiddenResponse({ description: 'Unauthorized Request' })
  @ApiOperation({
    summary: 'Список шаблонов ботов',
  })
  @Get()
  async findAll(): Promise<BotTemplate[]> {
    return await this.botTemplatesService.findAll();
  }

  @ApiOkResponse({
    description: 'The resource was returned successfully',
    type: BotTemplate,
  })
  @ApiForbiddenResponse({ description: 'Unauthorized Request' })
  @ApiNotFoundResponse({ description: 'Resource not found' })
  @ApiParam({
    name: 'id',
    description: 'Индификатор шаблона бота',
    example: '64f81ba37571bfaac18a857f',
  })
  @ApiOperation({
    summary: 'Получить шаблон бота по id',
  })
  @Get(':id')
  findOne(@Param('id') id: string): Promise<BotTemplate> {
    return this.botTemplatesService.findById(id);
  }

  @ApiCreatedResponse({
    description: 'The record has been successfully created.',
    type: BotTemplate,
  })
  @ApiOperation({
    summary: 'Создать шаблон бота',
  })
  @ApiBody({ type: CreateBotTemplateDto })
  @Post()
  async create(
    @Body() createBotTemplateDto: CreateBotTemplateDto,
  ): Promise<BotTemplate> {
    return await this.botTemplatesService.create(createBotTemplateDto);
  }

  @ApiOkResponse({
    description: 'The resource was updated successfully',
    type: BotTemplate,
  })
  @ApiNotFoundResponse({ description: 'Resource not found' })
  @ApiForbiddenResponse({ description: 'Unauthorized Request' })
  @ApiUnprocessableEntityResponse({ description: 'Bad Request' })
  @ApiBody({ type: UpdateBotTemplateDto })
  @ApiParam({
    name: 'id',
    description: 'Индификатор шаблона бота',
    example: '64f81ba37571bfaac18a857f',
  })
  @ApiOperation({
    summary: 'Изменить шаблон бота',
  })
  @Patch(':id')
  update(
    @Body() updateBotTemplateDto: UpdateBotTemplateDto,
    @Param('id') id: string,
  ) {
    return this.botTemplatesService.update(id, updateBotTemplateDto);
  }
}
