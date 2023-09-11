import { Controller, Post, Body, Delete, Patch, Get, Req, Param } from '@nestjs/common';
import { BotAccessesService } from './botAccesses.service';
import { CreateBotAccessDto } from './dto/create-bot-access.dto';
import { UpdateBotAccessDto } from './dto/update-bot-access.dto';
import { ShareBotAccessDto } from './dto/share-bot-access.dto';
import { BotAccess } from './shema/botAccesses.shema';


@Controller('bots-accesses')
export class BotAccessesController {
  constructor(private readonly botAccessesService: BotAccessesService) {}

  @Post()
  create(@Req() req, @Body() createBotAccess: CreateBotAccessDto): Promise<BotAccess> {
    // доделать после авторизации
    // return this.botAccessesService.create(createBotAccess, req.user.id);
    return this.botAccessesService.create('123', createBotAccess);
  }

  @Get()
  findAll() {
    return this.botAccessesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.botAccessesService.findOne(id);
  }

  @Patch(':id')
  update(@Req() req, @Param('id') botAccessId: string, @Body() updateBotAccessDto: UpdateBotAccessDto) {
    //return this.botAccessesService.updateAccess(req.user.id, botAccessId, updateBotAccessDto);
    return this.botAccessesService.updateAccess('123', botAccessId, updateBotAccessDto);
  }

  @Delete(':botAccessId')
  delete(@Req() req, @Param('botAccessId') botAccessId: string) {
    // return this.botAccessesService.delete(req.user.id, botAccessId);
    return this.botAccessesService.delete('123', botAccessId);
  }

  @Get(':botId/:userId')
  getPermission(@Param('botId') botId: string, @Param('userId') userId: string): Promise<string> {
    return this.botAccessesService.getPermission(userId, botId);
  }

  @Post(':botId')
  shareAccess(@Req() req, @Param('botId') botId: string, @Body() shareBotAccessDto: ShareBotAccessDto) {
    //return this.botAccessesService.shareAccess(req.user.id, botId, shareBotAccessDto);
    return this.botAccessesService.shareAccess('123', botId, shareBotAccessDto);
  }
}
