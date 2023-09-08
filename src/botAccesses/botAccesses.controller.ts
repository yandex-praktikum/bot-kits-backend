import { Controller, Post, Body, Delete, Patch, Get, Req, Param } from '@nestjs/common';
import { BotAccessesService } from './botAccesses.service';
import { CreateBotAccessDto } from './dto/create-bot-access.dto';
import { UpdateBotAccessDto } from './dto/update-bot-access.dto';
import { ShareBotAccessDto } from './dto/share-bot-access.dto';


@Controller('bots/accesses')
export class BotAccessesController {
  constructor(private readonly botAccessesService: BotAccessesService) {}

  @Post()
  create(@Req() req, @Body() createBotAccess: CreateBotAccessDto) {
    return this.botAccessesService.create(createBotAccess, req.user.id);
  }

  @Get(':id')
  checkAccess(@Req() req, @Param('id') id: string) {
    return this.botAccessesService.checkAccess(req.user.id, id);
  }

  @Patch(':id')
  update(@Req() req, @Param('id') botId: string, @Body() updateBotAccessDto: UpdateBotAccessDto) {
    return this.botAccessesService.updateAccess(req.user.id, botId, updateBotAccessDto);
  }

  @Post(':id')
  shareAccess(@Req() req, @Param('id') botId: string, @Body() shareBotAccessDto: ShareBotAccessDto) {
    return this.botAccessesService.shareAccess(req.user.id, botId, shareBotAccessDto);
  }

  @Delete()
  delete(@Body() botAccessId: string) {
    return this.botAccessesService.delete(+botAccessId);
  }
}
