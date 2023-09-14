import {
  Controller,
  Post,
  Body,
  Delete,
  Patch,
  Get,
  Req,
  Param,
  UseGuards,
} from '@nestjs/common';
import { BotAccessesService } from './botAccesses.service';
import { CreateBotAccessDto } from './dto/create-bot-access.dto';
import { UpdateBotAccessDto } from './dto/update-bot-access.dto';
import { ShareBotAccessDto } from './dto/share-bot-access.dto';
import { BotAccess } from './shema/botAccesses.shema';
import { JwtGuard } from '../auth/guards/jwtAuth.guards';
import {
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiBody,
} from '@nestjs/swagger';

@ApiTags('botAccesses')
@UseGuards(JwtGuard)
@Controller('bot-accesses')
export class BotAccessesController {
  constructor(private readonly botAccessesService: BotAccessesService) {}

  @ApiOperation({
    summary: 'Создает доступ',
    description:
      'Создает запись о доступе пользователя к боту, используется при создании бота',
  })
  @ApiCreatedResponse({
    description: 'Запись о доступе создана.',
    type: BotAccess,
  })
  @ApiBody({ type: CreateBotAccessDto })
  @Post()
  create(
    @Req() req,
    @Body() createBotAccess: CreateBotAccessDto,
  ): Promise<BotAccess> {
    return this.botAccessesService.create(req.user.id, createBotAccess);
  }

  @ApiOperation({ summary: 'Найти все доступы' })
  @ApiOkResponse({
    description: 'Все доступы найдены.',
    type: [BotAccess],
  })
  @Get()
  findAll() {
    return this.botAccessesService.findAll();
  }

  @ApiOperation({
    summary: 'Найти доступ по ID',
    description:
      'ВАЖНО! Находит доступ по botAccessId (запись о связи botId и userId)',
  })
  @ApiOkResponse({
    description: 'Доступ найден.',
    type: BotAccess,
  })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.botAccessesService.findOne(id);
  }

  @ApiOperation({
    summary: 'Изменить уровень доступа',
    description: 'Изменяет уровень существующего доступа',
  })
  @ApiOkResponse({
    description: 'Доступ изменен.',
    type: BotAccess,
  })
  @ApiBody({ type: UpdateBotAccessDto })
  @Patch(':id')
  update(
    @Req() req,
    @Param('id') botAccessId: string,
    @Body() updateBotAccessDto: UpdateBotAccessDto,
  ) {
    return this.botAccessesService.updateAccess(
      req.user.id,
      botAccessId,
      updateBotAccessDto,
    );
  }

  @ApiOperation({
    summary: 'Удалить доступ',
  })
  @ApiOkResponse({
    description: 'Доступ удален.',
    type: BotAccess,
  })
  @Delete(':id')
  delete(@Req() req, @Param('id') botAccessId: string) {
    return this.botAccessesService.delete(req.user.id, botAccessId);
  }

  @ApiOperation({
    summary: 'Получить доступ',
    description: 'Позвоялет проверить уровень доступа по botId и userId',
  })
  @ApiOkResponse({
    description: 'Информация о доступе по botId и userId получена.',
    type: 'admin',
  })
  @Get(':botId/:userId')
  getPermission(
    @Param('botId') botId: string,
    @Param('userId') userId: string,
  ): Promise<string> {
    return this.botAccessesService.getPermission(userId, botId);
  }

  @ApiOperation({
    summary: 'Поделиться доступом',
    description:
      'Позвоялет поделиться доступом по botId и создать новый доступ, если пользователь имеет уровень доступа super_admin к данному боту',
  })
  @ApiCreatedResponse({
    description: 'Новый доступ создан.',
    type: BotAccess,
  })
  @ApiBody({ type: ShareBotAccessDto })
  @Post(':botId')
  shareAccess(
    @Req() req,
    @Param('botId') botId: string,
    @Body() shareBotAccessDto: ShareBotAccessDto,
  ) {
    return this.botAccessesService.shareAccess(
      req.user.id,
      botId,
      shareBotAccessDto,
    );
  }
}
