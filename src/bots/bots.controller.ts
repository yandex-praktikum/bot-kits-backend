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
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import { BotsService } from './bots.service';
import mongoose from 'mongoose';
import { Bot } from './schema/bots.schema';
import { CreateBotDto } from './dto/create-bot.dto';
import { JwtGuard } from '../auth/guards/jwtAuth.guards';

@ApiTags('bots')
@UseGuards(JwtGuard)
@Controller('bots')
export class BotsController {
  constructor(private readonly botsService: BotsService) {}

  @Get()
  @ApiOperation({
    summary: 'Список ботов пользователя',
  })
  @ApiOkResponse({
    description: 'The resources were returned successfully',
    type: [Bot],
  })
  @ApiForbiddenResponse({ description: 'Unauthorized Request' })
  findMy(@Req() req): Promise<Bot[] | null> {
    return this.botsService.findAllByUser(req.user.id);
  }

  @Post()
  @ApiOperation({
    summary: 'Создание нового бота',
  })
  @ApiBody({ type: CreateBotDto })
  @ApiCreatedResponse({
    description: 'The record has been successfully created.',
    type: Bot,
  })
  create(@Req() req, @Body() createBotDto: CreateBotDto): Promise<Bot> {
    return this.botsService.create(req.user.id, createBotDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Удаление бота',
  })
  remove(@Req() req, @Param('id') id: string): Promise<Bot> {
    return this.botsService.remove(req.user.id, id);
  }

  @ApiOperation({
    summary: 'Копирование бота',
  })
  @Post(':id/copy')
  copy(@Req() req, @Param('id') id: string) {
    return this.botsService.copy(req.user.id, id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Смена имени бота',
  })
  @ApiOkResponse({
    description: 'The resource was updated successfully',
    type: Bot,
  })
  @ApiForbiddenResponse({ description: 'Unauthorized Request' })
  @ApiNotFoundResponse({ description: 'Resource not found' })
  @ApiUnprocessableEntityResponse({ description: 'Bad Request' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        botName: {
          type: 'string',
        },
      },
    },
  })
  update(
    @Req() req,
    @Param('id') id: string,
    @Body() body: { botName: 'string' },
  ): Promise<Bot> {
    return this.botsService.update(req.user.id, id, body);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Данные бота по Id',
  })
  findOne(@Param('id') id: string): Promise<Bot> {
    return this.botsService.findOne(id);
  }
}
