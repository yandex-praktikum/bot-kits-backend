import { Injectable } from '@nestjs/common';
import { Notification } from './schema/notifications.schema';
import { CreateNotificationDto } from './dto/create-notification.dto';
import UpdateNotificationDto from './dto/update-notification.dto';
import { NotificationRepository } from './notifications.repository';

@Injectable()
export class NotificationService {
  constructor(private readonly dbQuery: NotificationRepository) {}

  async create(
    createNotificationDto: CreateNotificationDto,
  ): Promise<Notification> {
    return await this.dbQuery.create(createNotificationDto);
  }

  async findAll(): Promise<Notification[]> {
    return await this.dbQuery.findAll();
  }

  async findbyId(id: string): Promise<Notification> {
    return await this.dbQuery.findbyId(id);
  }

  async remove(id: string): Promise<Notification> {
    return await this.dbQuery.remove(id);
  }

  async update(updateNotificationDto: UpdateNotificationDto, id: string) {
    return await this.dbQuery.update(updateNotificationDto, id);
  }
  async updateStatus(
    updateNotificationDto: UpdateNotificationDto,
    id: string,
  ): Promise<Notification> {
    return await this.dbQuery.update(updateNotificationDto, id);
  }
}
