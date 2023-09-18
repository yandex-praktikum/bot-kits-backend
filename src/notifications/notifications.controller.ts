import {
  Controller,
  Get,
  Post,
  Header,
  Body,
  Delete,
  Param,
  Patch,
  HttpStatus,
} from '@nestjs/common';
import { NotificationService } from './notifications.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { Notification } from './schema/notifications.schema';
import UpdateNotificationDto from './dto/update-notification.dto';
import {
  ApiBody,
  ApiOperation,
  ApiTags,
  ApiResponse,
  ApiParam,
} from '@nestjs/swagger';

@ApiTags('notification')
@Controller('notification')
export class NotificationController {
  constructor(private notificationService: NotificationService) {}

  @ApiOperation({
    summary: 'Создать уведомление',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success',
    type: CreateNotificationDto,
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
  @Post()
  @Header('Content-Type', 'application/json')
  create(@Body() createNotificationDto: CreateNotificationDto) {
    this.notificationService.create(createNotificationDto);
  }

  @ApiOperation({
    summary: 'Все уведомления',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success',
    type: [Notification],
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
  @Get()
  getAll() {
    return this.notificationService.findAll();
  }

  @ApiOperation({
    summary: 'Получить уведомление по id',
  })
  @ApiParam({ name: 'id', required: true, description: 'notification id' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success',
    type: Notification,
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
  @Get(':id')
  findOne(@Param('id') id: string): Promise<Notification> {
    return this.notificationService.findbyId(id);
  }

  @ApiOperation({
    summary: 'Удалить уведомление',
  })
  @ApiParam({ name: 'id', required: true, description: 'notification id' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success',
    type: Notification,
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
  @Delete(':id')
  remove(@Param('id') id: string): Promise<Notification> {
    return this.notificationService.remove(id);
  }

  @ApiOperation({
    summary: 'Изменить уведомление',
  })
  @ApiBody({ type: UpdateNotificationDto })
  @ApiParam({ name: 'id', required: true, description: 'notification id' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success',
    type: UpdateNotificationDto,
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
  @Patch(':id')
  update(
    @Body() updateNotificationDto: UpdateNotificationDto,
    @Param('id') id: string,
  ) {
    return this.notificationService.update(updateNotificationDto, id);
  }
}
