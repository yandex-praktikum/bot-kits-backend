import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Post,
  Delete,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('bots')
//@UseGuards(JwtAuthGuard)
@Controller('bots')
export class BotsController {
  // constructor(
  // ) { }

  @ApiOperation({
    summary: 'Список ботов пользователя',
  })
  @Get()
  findMy() {
    //@AuthUser() user
    //return ;
  }

  @ApiOperation({
    summary: 'Создание нового бота',
  })
  @Post()
  create() {
    //@AuthUser() user,
    //return ;
  }

  @ApiOperation({
    summary: 'Удаление бота',
  })
  @Delete(':id')
  remove(
    //@AuthUser() user,
    @Param('id') id: number,
  ) {
    //return ;
  }

  @ApiOperation({
    summary: 'Копирование бота',
  })
  @Post(':id')
  copy(
    //@AuthUser() user,
    @Param('id') id: number,
  ) {
    //return ;
  }

  @ApiOperation({
    summary: 'Смена имени бота',
  })
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
  @Patch(':id')
  update(
    //@AuthUser() user,
    @Param('id') id: number,
    @Body() body: { botName: 'string' },
  ) {
    //return ;
  }

  @ApiOperation({
    summary: 'Настройки уведомлений бота',
  })
  @Get(':id/notificationLinks')
  notificationLinks(
    //@AuthUser() user,
    @Param('id') id: number,
  ) {
    //return ;
  }

  @ApiOperation({
    summary: 'Ссылка на бота',
  })
  @Get(':id/link')
  getLink(
    //@AuthUser() user,
    @Param('id') id: number,
  ): string {
    return '';
  }

  @ApiOperation({
    summary: 'Данные бота пользователя',
  })
  @Get(':id')
  findOne(
    //@AuthUser() user,
    @Param('id') id: number,
  ) {
    //return ;
  }

  @ApiOperation({
    summary: 'Поделиться доступом к боту',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: {
          type: 'string',
        },
      },
    },
  })
  @Post(':id/share')
  share(
    //@AuthUser() user,
    @Param('id') id: number,
    @Body() body: { email: 'string' },
  ) {
    //return ;
  }
}
