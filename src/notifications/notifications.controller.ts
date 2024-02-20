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
  UseGuards,
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
import { JwtGuard } from 'src/auth/guards/jwtAuth.guards';
import { CheckAbility } from 'src/auth/decorators/ability.decorator';
import { AbilityGuard } from 'src/auth/guards/ability.guard';
import { Action } from 'src/ability/ability.factory';

export enum NotificationType {
  SYSTEM = 'Системное',
  USER = 'Пользовательское',
  BOT = 'От бота',
}

@UseGuards(JwtGuard)
@ApiTags('notification')
@ApiBearerAuth()
@Controller('notification')
export class NotificationController {
  constructor(private notificationService: NotificationService) {}

  @CheckAbility({ action: Action.Create, subject: CreateNotificationDto })
  @UseGuards(AbilityGuard)
  @Post()
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
  @Header('Content-Type', 'application/json')
  create(@Body() createNotificationDto: CreateNotificationDto) {
    this.notificationService.create(createNotificationDto);
  }

  @CheckAbility({ action: Action.Read, subject: UpdateNotificationDto })
  @UseGuards(AbilityGuard)
  @Get()
  @ApiOperation({
    summary: 'Все уведомления',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Уведомления успешно получены',
    type: [Notification],
  })
  @ApiForbiddenResponse({ description: 'Отказ в доступе' })
  getAll(): Promise<Notification[]> {
    return this.notificationService.findAll();
  }

  @CheckAbility({ action: Action.Read, subject: CreateNotificationDto })
  @UseGuards(AbilityGuard)
  @Get(':id')
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
  findOne(@Param('id') id: string): Promise<Notification> {
    return this.notificationService.findbyId(id);
  }

  @CheckAbility({ action: Action.Delete, subject: CreateNotificationDto })
  @UseGuards(AbilityGuard)
  @Delete(':id')
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
  remove(@Param('id') id: string): Promise<Notification> {
    return this.notificationService.remove(id);
  }

  @CheckAbility({ action: Action.Update, subject: CreateNotificationDto })
  @UseGuards(AbilityGuard)
  @Patch(':id')
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
  update(
    @Body() updateNotificationDto: UpdateNotificationDto,
    @Param('id') id: string,
  ): Promise<Notification> {
    return this.notificationService.update(updateNotificationDto, id);
  }

  @CheckAbility({ action: Action.Update, subject: UpdateNotificationDto })
  @UseGuards(AbilityGuard)
  @Patch(':id/status')
  @ApiOperation({
    summary: 'Изменить статус уведомления',
  })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Идентификатор уведомления',
    example: '64f81ba37571bfaac18a857f',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Статус уведомления успешно изменен',
    type: Notification,
  })
  @ApiForbiddenResponse({ description: 'Отказ в доступе' })
  @ApiNotFoundResponse({ description: 'Ресурс не найден' })
  updateStatus(
    @Param('id') id: string,
    @Body('status') updateNotificationDto: UpdateNotificationDto,
  ): Promise<Notification> {
    return this.notificationService.update(updateNotificationDto, id);
  }
}
