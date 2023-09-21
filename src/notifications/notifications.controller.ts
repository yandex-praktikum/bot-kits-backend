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
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';

@ApiTags('notification')
@ApiBearerAuth()
@Controller('notification')
export class NotificationController {
  constructor(private notificationService: NotificationService) {}

  @ApiOperation({
    summary: 'Создать уведомление',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Уведомление успешно создано',
    type: CreateNotificationDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Неверный запрос',
  })
  @ApiForbiddenResponse({ description: 'Отказ в доступе' })
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
    description: 'Уведомления успешно получены',
    type: [Notification],
  })
  @ApiForbiddenResponse({ description: 'Отказ в доступе' })
  @Get()
  getAll() {
    return this.notificationService.findAll();
  }

  @ApiOperation({
    summary: 'Получить уведомление по id',
  })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Идентификатор уведомления',
    example: '64f81ba37571bfaac18a857f',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Уведомление успешно получено',
    type: Notification,
  })
  @ApiForbiddenResponse({ description: 'Отказ в доступе' })
  @ApiNotFoundResponse({ description: 'Ресурс не найден' })
  @Get(':id')
  findOne(@Param('id') id: string): Promise<Notification> {
    return this.notificationService.findbyId(id);
  }

  @ApiOperation({
    summary: 'Удалить уведомление',
  })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Идентификатор уведомления',
    example: '64f81ba37571bfaac18a857f',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Уведомление успешно удалено',
    type: Notification,
  })
  @ApiForbiddenResponse({ description: 'Отказ в доступе' })
  @ApiNotFoundResponse({ description: 'Ресурс не найден' })
  @Delete(':id')
  remove(@Param('id') id: string): Promise<Notification> {
    return this.notificationService.remove(id);
  }

  @ApiOperation({
    summary: 'Изменить уведомление',
  })
  @ApiBody({ type: UpdateNotificationDto })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Идентификатор уведомления',
    example: '64f81ba37571bfaac18a857f',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Уведомление успешно изменено',
    type: UpdateNotificationDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Неверный запрос',
  })
  @ApiForbiddenResponse({ description: 'Отказ в доступе' })
  @ApiNotFoundResponse({ description: 'Ресурс не найден' })
  @Patch(':id')
  update(
    @Body() updateNotificationDto: UpdateNotificationDto,
    @Param('id') id: string,
  ) {
    return this.notificationService.update(updateNotificationDto, id);
  }
}
