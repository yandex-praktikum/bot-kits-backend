import {
  Controller,
  Get,
  Post,
  Header,
  Body,
  Delete,
  Param,
  Patch,
} from '@nestjs/common';
import { NotificationService } from './notification.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { Notification } from './entities/notification.schema';
import UpdateNotificationDto from './dto/update-notification.dto';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('notification')
@Controller('notification')
export class NotificationController {
  constructor(private notificationService: NotificationService) {}

  @ApiOperation({
    summary: 'Создать уведомление',
  })
  @Post('create')
  @Header('Content-Type', 'application/json')
  create(@Body() createNotificationDto: CreateNotificationDto) {
    this.notificationService.create(createNotificationDto);
  }

  @ApiOperation({
    summary: 'Все уведомления',
  })
  @Get('all')
  getAll() {
    return this.notificationService.findAll();
  }

  @ApiOperation({
    summary: 'Получить уведомление по id',
  })
  @Get(':id')
  findOne(@Param('id') id: string): Promise<Notification> {
    return this.notificationService.findbyId(id);
  }

  @ApiOperation({
    summary: 'Удалить уведомление',
  })
  @Delete(':id')
  remove(@Param('id') id: string): Promise<Notification> {
    return this.notificationService.remove(id);
  }

  @ApiOperation({
    summary: 'Изменить уведомление',
  })
  @ApiBody({ type: UpdateNotificationDto })
  @Patch(':id')
  update(
    @Body() updateNotificationDto: UpdateNotificationDto,
    @Param('id') id: string,
  ) {
    return this.notificationService.update(updateNotificationDto, id);
  }
}
