import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Post,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiParam,
  ApiBearerAuth,
  ApiBadRequestResponse,
} from '@nestjs/swagger';
import { BotsService } from './bots.service';
import { Bot } from './schema/bots.schema';
import { CreateBotDto } from './dto/create-bot.dto';
import { JwtGuard } from '../auth/guards/jwtAuth.guards';
import { ShareBotDto } from './dto/share-bot.dto';
import { BotCreateRequestBody } from './sdo/request-body.sdo';
import { UpdateBotDto } from './dto/update-bot.dto';
import { CreateTemplateDto } from './dto/create-template.dto';
import { UpdateTemplateDto } from './dto/update-template.dto';
import { CopyBotDto } from './dto/copy-bot.dto';
import { CheckAbility } from 'src/auth/decorators/ability.decorator';
import { Action } from 'src/ability/ability.factory';
import { AbilityGuard } from 'src/auth/guards/ability.guard';
import { TJwtRequest } from 'src/types/jwtRequest';

@UseGuards(JwtGuard)
@ApiBearerAuth()
@ApiTags('bots')
@Controller('bots')
export class BotsController {
  constructor(private readonly botsService: BotsService) {}
  @CheckAbility({ action: Action.Read, subject: CreateBotDto })
  @UseGuards(AbilityGuard)
  @Get()
  @ApiOperation({
    summary: 'Получить ботов пользователя',
  })
  @ApiOkResponse({
    description: 'Запрос выполнен успешно',
    type: [Bot],
  })
  @ApiForbiddenResponse({ description: 'Отказ в доступе' })
  @ApiNotFoundResponse({ description: 'Ресурс не найден' })
  async findMy(@Req() req): Promise<Bot[]> {
    return await this.botsService.findAllByUser(req.user.id);
  }

  @UseGuards(AbilityGuard)
  @CheckAbility({ action: Action.Create, subject: CreateBotDto })
  @Post()
  @ApiOperation({
    summary: 'Создание нового бота',
  })
  @ApiCreatedResponse({
    description: 'Новый бот создан',
    type: Bot,
  })
  @ApiForbiddenResponse({ description: 'Отказ в доступе' })
  @ApiBadRequestResponse({ description: 'Неверный запрос' })
  @ApiBody({ type: BotCreateRequestBody })
  create(@Req() req, @Body() createBotDto: CreateBotDto): Promise<Bot> {
    return this.botsService.create(req.user.id, createBotDto, req.ability);
  }

  @UseGuards(AbilityGuard)
  @CheckAbility({ action: Action.Read, subject: CreateTemplateDto })
  @Get('templates')
  @ApiOperation({
    summary: 'Получить все шаблоны бота',
  })
  @ApiOkResponse({
    description: 'Запрос выполнен успешно',
    type: [Bot],
  })
  @ApiForbiddenResponse({ description: 'Отказ в доступе' })
  @ApiNotFoundResponse({ description: 'Ресурс не найден' })
  async findTemplates(): Promise<Bot[]> {
    return await this.botsService.findAllTemplates();
  }

  @UseGuards(AbilityGuard)
  @CheckAbility({ action: Action.Create, subject: CreateTemplateDto })
  @Post('template')
  @ApiOperation({
    summary: 'Добавление шаблона бота админом',
  })
  @ApiOkResponse({
    description: 'Созданный шаблон',
    type: Bot,
  })
  @ApiBody({ type: CreateTemplateDto })
  createTemplate(@Body() createTemplateDto: CreateTemplateDto) {
    return this.botsService.addBotTemplate(createTemplateDto);
  }

  @UseGuards(AbilityGuard)
  @CheckAbility({ action: Action.Update, subject: CreateTemplateDto })
  @Patch('template/:id')
  @ApiOperation({
    summary: 'Обновление шаблона бота админом',
  })
  @ApiOkResponse({
    description: 'Обновленны шаблон бгота',
    type: Bot,
  })
  @ApiBody({ type: UpdateTemplateDto })
  updateTemplate(
    @Param('id') templateId: string,
    @Body() updateTemplateDto: UpdateTemplateDto,
  ) {
    return this.botsService.updateTemplate(templateId, updateTemplateDto);
  }

  @UseGuards(AbilityGuard)
  @CheckAbility({ action: Action.Delete, subject: CreateTemplateDto })
  @Delete('template/:id')
  @ApiOperation({
    summary: 'Удаление шаблона бота',
  })
  @ApiParam({
    name: 'id',
    description: 'Идентификатор шаблона',
    example: '64f81ba37571bfaac18a857f',
  })
  @ApiOkResponse({
    description: 'Шаблон удален',
    type: Bot,
  })
  @ApiNotFoundResponse({ description: 'Ресурс не найден' })
  removeTemplate(@Param('id') templateId: string): Promise<Bot> {
    return this.botsService.removeTemplate(templateId);
  }

  @UseGuards(AbilityGuard)
  @CheckAbility({ action: Action.Read, subject: CreateBotDto })
  @Get('template/:id')
  @ApiOperation({
    summary: 'Получение шаблона бота по id',
  })
  @ApiParam({
    name: 'id',
    description: 'Идентификатор шаблона',
    example: '64f81ba37571bfaac18a857f',
  })
  @ApiOkResponse({
    description: 'Шаблон найден',
    type: Bot,
  })
  @ApiNotFoundResponse({ description: 'Ресурс не найден' })
  getTemplate(@Param('id') templateId: string): Promise<Bot> {
    return this.botsService.findOne(templateId);
  }

  @UseGuards(AbilityGuard)
  @CheckAbility({ action: Action.Read, subject: CreateBotDto })
  @Get('bot/:id')
  @ApiOperation({
    summary: 'Получить данные бота по Id с правами',
  })
  @ApiParam({
    name: 'id',
    description: 'Идентификатор бота',
    example: '64f81ba37571bfaac18a857f',
  })
  @ApiOkResponse({
    description: 'Информация о боте по Id получена',
    type: Bot,
  })
  @ApiForbiddenResponse({ description: 'Отказ в доступе' })
  @ApiNotFoundResponse({ description: 'Ресурс не найден' })
  findOneBotWithAccess(
    @Param('id') id: string,
    @Req() req: TJwtRequest,
  ): Promise<Bot> {
    return this.botsService.findOneBotWithAccess(id, req.user.id);
  }

  @UseGuards(AbilityGuard)
  @CheckAbility({ action: Action.Read, subject: CreateBotDto })
  @Get(':id')
  @ApiOperation({
    summary: 'Получить данные бота по Id',
  })
  @ApiParam({
    name: 'id',
    description: 'Идентификатор бота',
    example: '64f81ba37571bfaac18a857f',
  })
  @ApiOkResponse({
    description: 'Информация о боте по Id получена',
    type: Bot,
  })
  @ApiForbiddenResponse({ description: 'Отказ в доступе' })
  @ApiNotFoundResponse({ description: 'Ресурс не найден' })
  findOne(@Param('id') id: string): Promise<Bot> {
    return this.botsService.findOne(id);
  }

  @UseGuards(AbilityGuard)
  @CheckAbility({ action: Action.Share, subject: CreateBotDto })
  @Post(':id/share')
  @ApiOperation({
    summary:
      'Предоставить общий доступ к боту, первичный доступ при отправке email',
  })
  @ApiCreatedResponse({
    description: 'Первичный доступ создан',
    type: Bot,
  })
  @ApiForbiddenResponse({ description: 'Отказ в доступе' })
  @ApiNotFoundResponse({ description: 'Ресурс не найден' })
  @ApiBadRequestResponse({ description: 'Неверный запрос' })
  @ApiBody({ type: ShareBotDto })
  @ApiParam({
    name: 'id',
    description: 'Идентификатор бота',
    example: '64f81ba37571bfaac18a857f',
  })
  share(
    @Req() req,
    @Param('id') id: string,
    @Body() shareBotDto: ShareBotDto,
  ): Promise<string> {
    return this.botsService.share(req.user.id, id, shareBotDto);
  }

  @UseGuards(AbilityGuard)
  @CheckAbility({ action: Action.Create, subject: CreateBotDto })
  @Post(':id')
  @ApiOperation({
    summary: 'Создание нового бота из шаблона',
  })
  @ApiCreatedResponse({
    description: 'Новый бот создан',
    type: Bot,
  })
  @ApiForbiddenResponse({ description: 'Отказ в доступе' })
  @ApiBadRequestResponse({ description: 'Неверный запрос' })
  @ApiBody({ type: BotCreateRequestBody })
  createBotsFromTemplate(
    @Req() req,
    @Body() createBotDto: CreateBotDto,
    @Param('id') id: string,
  ): Promise<Bot> {
    return this.botsService.create(req.user.id, createBotDto, req.ability, id);
  }

  @UseGuards(AbilityGuard)
  @CheckAbility({ action: Action.Create, subject: CreateBotDto })
  @Post('copy/:id')
  @ApiOperation({
    summary: 'Копирование бота',
  })
  @ApiCreatedResponse({
    description: 'Бот скопирован',
    type: Bot,
  })
  @ApiForbiddenResponse({ description: 'Отказ в доступе' })
  @ApiNotFoundResponse({ description: 'Ресурс не найден' })
  @ApiBadRequestResponse({ description: 'Неверный запрос' })
  @ApiBody({ type: CopyBotDto })
  @ApiParam({
    name: 'id',
    description: 'Идентификатор бота',
    example: '64f81ba37571bfaac18a857f',
  })
  copyBot(
    @Req() req,
    @Param('id') botId: string,
    @Body() copyBotDto: CopyBotDto,
  ) {
    return this.botsService.copyBot(
      req.user.id,
      botId,
      copyBotDto,
      req.ability,
    );
  }

  @UseGuards(AbilityGuard)
  @CheckAbility({ action: Action.Delete, subject: CreateBotDto })
  @Delete(':id')
  @ApiOperation({
    summary: 'Удаление бота',
  })
  @ApiParam({
    name: 'id',
    description: 'Идентификатор бота',
    example: '64f81ba37571bfaac18a857f',
  })
  @ApiOkResponse({
    description: 'Бот удален',
    type: Bot,
  })
  @ApiForbiddenResponse({ description: 'Отказ в доступе' })
  @ApiNotFoundResponse({ description: 'Ресурс не найден' })
  remove(@Req() req, @Param('id') id: string): Promise<Bot> {
    return this.botsService.remove(req.user.id, id, req.ability);
  }

  @CheckAbility({ action: Action.Update, subject: UpdateBotDto })
  @UseGuards(AbilityGuard)
  @Patch(':id')
  @ApiOperation({
    summary: 'Обновить бота',
  })
  @ApiOkResponse({
    description: 'Имя бота обновлено',
    type: Bot,
  })
  @ApiForbiddenResponse({ description: 'Отказ в доступе' })
  @ApiNotFoundResponse({ description: 'Ресурс не найден' })
  @ApiBody({ type: BotCreateRequestBody })
  @ApiParam({
    name: 'id',
    description: 'Идентификатор бота',
    example: '64f81ba37571bfaac18a857f',
  })
  update(
    @Req() req,
    @Param('id') botId: string,
    @Body() updateBotDto: UpdateBotDto,
  ): Promise<Bot> {
    return this.botsService.update(botId, updateBotDto, req.ability);
  }
}
