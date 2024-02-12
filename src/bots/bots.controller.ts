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
  UseInterceptors,
  Header,
  UploadedFiles,
} from '@nestjs/common';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiNotFoundResponse,
  ApiParam,
  ApiBearerAuth,
  ApiBadRequestResponse,
  ApiHeader,
  ApiUnauthorizedResponse,
  ApiConflictResponse,
} from '@nestjs/swagger';
import { BotsService } from './bots.service';
import { Bot } from './schema/bots.schema';
import { CreateBotDto } from './dto/create-bot.dto';
import { JwtGuard } from '../auth/guards/jwtAuth.guards';
import {
  BotCreateRequestBody,
  UpdateBotDescription,
} from './sdo/request-body.sdo';
import { UpdateBotDto } from './dto/update-bot.dto';
import { CreateTemplateDto } from './dto/create-template.dto';
import { UpdateTemplateDto } from './dto/update-template.dto';
import { CopyBotDto } from './dto/copy-bot.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { CheckAbility } from 'src/auth/decorators/ability.decorator';
import { Action } from 'src/ability/ability.factory';
import { AbilityGuard } from 'src/auth/guards/ability.guard';
import { TJwtRequest } from 'src/types/jwtRequest';
import {
  BotDataBadRequestResponse,
  BotDataConflictResponse,
  CreateBotResponseOk,
  CreateBotTemplateResponseOk,
  CreateTemplateResponseOk,
  DeleteBotBadRequestBad,
  DeleteTemplateBadRequestResponse,
  GetBotsResponseOk,
  GetBotsTemplatesResponseOk,
  TemplateDataConflictResponse,
  UpdateBotNotFoundBadRequest,
  UpdateBotResponseOk,
  UpdateTemplateBadRequestResponse,
  UserUnauthirizedResponse,
} from './sdo/response-body.sdo';

@UseGuards(JwtGuard)
@ApiBearerAuth()
@ApiTags('bots')
@ApiHeader({
  name: 'authorization',
  description: 'Access токен',
  required: true,
})
@Controller('bots')
export class BotsController {
  constructor(private readonly botsService: BotsService) {}
  @Post('files/upload')
  @UseInterceptors(FilesInterceptor('files'))
  async uploadFiles(@UploadedFiles() files: Array<Express.Multer.File>) {
    return await this.botsService.uploadFiles(files);
  }

  @Get('files/download/:id')
  @Header('Cross-Origin-Resource-Policy', 'cross-origin') //чтобы можно было запрашивать из тега <img src="...">
  async downloadFile(@Param('id') id: string) {
    return await this.botsService.downloadFile(id);
  }

  @Delete('files/delete/:id')
  deleteFile(@Param() id: string) {
    return this.botsService.deleteFile(id);
  }

  @CheckAbility({ action: Action.Read, subject: CreateBotDto })
  @UseGuards(AbilityGuard)
  @Get()
  @ApiOperation({
    summary: 'Получить ботов пользователя',
  })
  @ApiOkResponse({
    description: 'Запрос выполнен успешно',
    type: [GetBotsResponseOk],
  })
  @ApiUnauthorizedResponse({
    description: 'Отказ в доступе',
    type: UserUnauthirizedResponse,
  })
  async findMy(@Req() req): Promise<Bot[]> {
    return await this.botsService.findAllByUser(req.user.id);
  }

  @UseGuards(AbilityGuard)
  @CheckAbility({ action: Action.Create, subject: CreateBotDto })
  @Post()
  @ApiOperation({
    summary: 'Создание нового бота',
  })
  @ApiBody({
    type: CreateBotDto,
  })
  @ApiCreatedResponse({
    description: 'Новый бот создан',
    type: CreateBotResponseOk,
  })
  @ApiBadRequestResponse({
    description: 'Неверный запрос',
    type: BotDataBadRequestResponse,
  })
  @ApiUnauthorizedResponse({
    description: 'Отказ в доступе',
    type: UserUnauthirizedResponse,
  })
  @ApiConflictResponse({
    description: 'Конфликт данных',
    type: BotDataConflictResponse,
  })
  @ApiBody({ type: BotCreateRequestBody })
  create(@Req() req, @Body() createBotDto: CreateBotDto): Promise<Bot> {
    return this.botsService.create(req.user.id, createBotDto, req.ability);
  }

  @UseGuards(AbilityGuard)
  @CheckAbility({ action: Action.Read, subject: CreateBotDto })
  @Get('templates')
  @ApiOperation({
    summary: 'Получить все шаблоны бота',
  })
  @ApiOkResponse({
    description: 'Запрос выполнен успешно',
    type: [GetBotsTemplatesResponseOk],
  })
  @ApiUnauthorizedResponse({
    description: 'Отказ в доступе',
    type: UserUnauthirizedResponse,
  })
  async findTemplates(): Promise<Bot[]> {
    return await this.botsService.findAllTemplates();
  }

  @UseGuards(AbilityGuard)
  @CheckAbility({ action: Action.Create, subject: CreateTemplateDto })
  @Post('template')
  @ApiOperation({
    summary: 'Добавление шаблона бота админом',
  })
  @ApiCreatedResponse({
    description: 'Созданный шаблон',
    type: CreateTemplateResponseOk,
  })
  @ApiUnauthorizedResponse({
    description: 'Отказ в доступе',
    type: UserUnauthirizedResponse,
  })
  @ApiConflictResponse({
    description: 'Конфликт данных',
    type: TemplateDataConflictResponse,
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
  @ApiParam({
    name: 'id',
    description: 'Идентификатор шаблона',
    example: '64f81ba37571bfaac18a857f',
  })
  @ApiOkResponse({
    description: 'Обновленны шаблон бгота',
    type: GetBotsTemplatesResponseOk,
  })
  @ApiBody({ type: UpdateTemplateDto })
  @ApiUnauthorizedResponse({
    description: 'Отказ в доступе',
    type: UserUnauthirizedResponse,
  })
  @ApiNotFoundResponse({
    description: 'Ресурс не найден',
    type: UpdateTemplateBadRequestResponse,
  })
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
    type: GetBotsTemplatesResponseOk,
  })
  @ApiUnauthorizedResponse({
    description: 'Отказ в доступе',
    type: UserUnauthirizedResponse,
  })
  @ApiNotFoundResponse({
    description: 'Ресурс не найден',
    type: DeleteTemplateBadRequestResponse,
  })
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
    type: GetBotsTemplatesResponseOk,
  })
  @ApiUnauthorizedResponse({
    description: 'Отказ в доступе',
    type: UserUnauthirizedResponse,
  })
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
    type: GetBotsResponseOk,
  })
  @ApiUnauthorizedResponse({
    description: 'Отказ в доступе',
    type: UserUnauthirizedResponse,
  })
  findOneBotWithAccess(
    @Param('id') id: string,
    @Req() req: TJwtRequest,
  ): Promise<Bot> {
    return this.botsService.findOneBotWithAccess(id, req.user.id);
  }

  @UseGuards(AbilityGuard)
  @CheckAbility({ action: Action.Create, subject: CreateBotDto })
  @Post('copy/:id')
  @ApiOperation({
    summary: 'Копирование бота',
  })
  @ApiCreatedResponse({
    description: 'Бот скопирован',
    type: CreateBotResponseOk,
  })
  @ApiUnauthorizedResponse({
    description: 'Отказ в доступе',
    type: UserUnauthirizedResponse,
  })
  @ApiBadRequestResponse({
    description: 'Ресурс не найден',
    type: '',
  })
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
  @CheckAbility({ action: Action.Update, subject: UpdateBotDto })
  @Patch('bot/:id')
  @ApiBody({ type: UpdateBotDescription })
  @ApiOperation({
    summary: 'Обновить бота',
  })
  @ApiOkResponse({
    description: 'Имя бота обновлено',
    type: UpdateBotResponseOk,
  })
  @ApiBadRequestResponse({
    description: 'Неверный запрос',
    type: BotDataBadRequestResponse,
  })
  @ApiUnauthorizedResponse({
    description: 'Отказ в доступе',
    type: UserUnauthirizedResponse,
  })
  @ApiNotFoundResponse({
    description: 'Ресурс не найден',
    type: UpdateBotNotFoundBadRequest,
  })
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
    type: GetBotsTemplatesResponseOk,
  })
  @ApiUnauthorizedResponse({
    description: 'Отказ в доступе',
    type: UserUnauthirizedResponse,
  })
  @ApiNotFoundResponse({
    description: 'Ресурс не найден',
    type: DeleteBotBadRequestBad,
  })
  remove(@Req() req, @Param('id') id: string): Promise<Bot> {
    return this.botsService.remove(req.user.id, id, req.ability);
  }

  @UseGuards(AbilityGuard)
  @CheckAbility({ action: Action.Create, subject: CreateBotDto })
  @Post(':id')
  @ApiOperation({
    summary: 'Создание нового бота из шаблона',
  })
  @ApiCreatedResponse({
    description: 'Новый бот создан',
    type: CreateBotTemplateResponseOk,
  })
  @ApiUnauthorizedResponse({
    description: 'Отказ в доступе',
    type: UserUnauthirizedResponse,
  })
  @ApiBody({ type: BotCreateRequestBody })
  createBotsFromTemplate(
    @Req() req,
    @Body() createBotDto: CreateBotDto,
    @Param('id') id: string,
  ): Promise<Bot> {
    return this.botsService.create(req.user.id, createBotDto, req.ability, id);
  }
}
