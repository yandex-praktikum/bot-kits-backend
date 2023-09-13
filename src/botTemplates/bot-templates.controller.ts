import { Body, Controller, Get, Param, Patch, Post } from "@nestjs/common";
import { ApiBody, ApiCreatedResponse, ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";
import { BotTemplatesService } from "./bot-templates.service";
import { BotTemplate } from "./schema/bot-template.schema";
import UpdateBotTemplateDto from "./dto/update.bot-template.dto";
import CreateBotTemplateDto from "./dto/create.bot-template.dto";

@ApiTags("botTemplates")
@Controller("botTemplates")
export class BotTemplatesController {
  constructor(private readonly botTemplatesService: BotTemplatesService) {
  }

  @ApiOperation({
    summary: "Список шаблонов ботов"
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
    summary: "Создать шаблон бота"
  })
  @ApiBody({ type: CreateBotTemplateDto })
  @ApiCreatedResponse({
    description: "The record has been successfully created.",
    type: UpdateBotTemplateDto
  })
  @Post()
  async create(@Body() createBotTemplateDto: CreateBotTemplateDto) {
    return await this.botTemplatesService.create(createBotTemplateDto);
  }

  @ApiOperation({
    summary: "Изменить шаблон бота"
  })
  @ApiBody({ type: UpdateBotTemplateDto })
  @ApiCreatedResponse({
    description: "The record has been updated created.",
    type: UpdateBotTemplateDto
  })
  @ApiParam({
    name: "id",
    description: "Индификатор шаблона",
    example: "64f81ba37571bfaac18a857f"
  })
  @Patch(":id")
  update(@Body() updateBotTemplateDto: UpdateBotTemplateDto, @Param("id") id: string) {
    return this.botTemplatesService.update(id, updateBotTemplateDto);
  }
}
