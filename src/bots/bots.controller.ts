import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Post,
  Delete,
} from '@nestjs/common';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags, ApiUnprocessableEntityResponse
} from '@nestjs/swagger';
import {BotsService} from "./bots.service";
import mongoose from "mongoose";
import {Bot} from "./schema/bots.schema";
import {CreateBotDto} from "./dto/create-bot.dto";

@ApiTags('bots')
// @UseGuards(JwtGuard)
@Controller('bots')
export class BotsController {
  constructor(private readonly botsService: BotsService) {}

  @Get()
  @ApiOperation({
    summary: 'Список ботов пользователя',
  })
  @ApiBody({ type: mongoose.Schema.Types.ObjectId })
  @ApiOkResponse({
    description: 'The resources were returned successfully',
    type: [Bot],
  })
  @ApiForbiddenResponse({ description: 'Unauthorized Request' })
  findMy(@Body() userId: string): Promise<Bot[] | null> {
    return this.botsService.findAllByUser(userId)
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
  create(@Body() createBotDto: CreateBotDto): Promise<Bot> {
    return this.botsService.create(createBotDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Удаление бота',
  })
  remove(@Param('id') id: string): Promise<Bot> {
    return this.botsService.remove(id);
  }

  // @ApiOperation({
  //   summary: 'Копирование бота',
  // })
  // @Post(':id')
  // copy(@Param('id') id: string) {
  //   //return ;
  // }

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
    @Param('id') id: string,
    @Body() body: { botName: 'string' }): Promise<Bot> {
    return this.botsService.update(id, body);
  }

  // @ApiOperation({
  //   summary: 'Настройки уведомлений бота',
  // })
  // @Get(':id/notificationLinks')
  // notificationLinks(
  //   //@AuthUser() user,
  //   @Param('id') id: number,
  // ) {
  //   //return ;
  // }

  // @ApiOperation({
  //   summary: 'Ссылка на бота',
  // })
  // @Get(':id/link')
  // getLink(
  //   //@AuthUser() user,
  //   @Param('id') id: number,
  // ): string {
  //   return '';
  // }

  @Get(':id')
  @ApiOperation({
    summary: 'Данные бота пользователя',
  })
  findOne(@Param('id') id: string): Promise<Bot> {
    return this.botsService.findOne(id);
  }

  // @ApiOperation({
  //   summary: 'Поделиться доступом к боту',
  // })
  // @ApiBody({
  //   schema: {
  //     type: 'object',
  //     properties: {
  //       email: {
  //         type: 'string',
  //       },
  //     },
  //   },
  // })
  // @Post(':id/share')
  // share(
  //   //@AuthUser() user,
  //   @Param('id') id: number,
  //   @Body() body: { email: 'string' },
  // ) {
  //   //return ;
  // }
}
