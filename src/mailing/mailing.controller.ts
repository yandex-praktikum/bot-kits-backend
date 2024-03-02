import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { MailingService } from './mailing.service';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { Mailing } from './schema/mailing.schema';
import { JwtGuard } from 'src/auth/guards/jwtAuth.guards';
import { TJwtRequest } from 'src/types/jwtRequest';
import { CreateMailingDTO } from './dto/create-mailing.dto';
import { UpdateMailingDTO } from './dto/update-mailing.dto';

@UseGuards(JwtGuard)
@ApiTags('mailing')
@ApiBearerAuth()
@Controller('mailing')
export class MailingController {
  constructor(private readonly mailingService: MailingService) {}

  @ApiOperation({
    summary: 'Создать рассылку',
  })
  @Post()
  createMailing(
    @Req() { user }: TJwtRequest,
    @Body() createMailingDTO: CreateMailingDTO,
  ): Promise<Mailing> {
    return this.mailingService.create(user, createMailingDTO);
  }

  @ApiOperation({
    summary: 'Все рассылки бота',
  })
  @Get('/bot/:id')
  getAllByBotId(@Param('id') botId: string): Promise<Mailing[]> {
    return this.mailingService.findAllByBotId(botId);
  }

  @ApiOperation({
    summary: 'Все рассылки',
  })
  @Get('/all')
  getAll(): Promise<Mailing[]> {
    return this.mailingService.findAll();
  }

  @ApiOperation({
    summary: 'Получить рассылку по id',
  })
  @Get(':id')
  getById(@Param('id') id: string): Promise<Mailing> {
    return this.mailingService.findById(id);
  }

  @ApiOperation({
    summary: 'Удалить рассылку по id',
  })
  @Delete(':id')
  remove(@Param('id') id: string): Promise<Mailing> {
    return this.mailingService.remove(id);
  }

  @ApiOperation({
    summary: 'Обновить рассылку',
  })
  @Patch(':id')
  update(
    @Body() updateMailingDTO: UpdateMailingDTO,
    @Param('id') id: string,
    @Req() { user }: TJwtRequest,
  ) {
    return this.mailingService.update(updateMailingDTO, id, user._id);
  }
}
