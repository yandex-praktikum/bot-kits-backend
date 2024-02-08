import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Notification,
  NotificationSchema,
} from './schema/notifications.schema';
import { NotificationController } from './notifications.controller';
import { NotificationService } from './notifications.service';
import { ProfilesModule } from 'src/profiles/profiles.module';
import { NotificationRepository } from './notifications.repository';
import { AbilityModule } from 'src/ability/ability.module';

@Module({
  imports: [
    ProfilesModule,
    MongooseModule.forFeature([
      {
        name: Notification.name,
        schema: NotificationSchema,
      },
    ]),
    AbilityModule,
  ],

  controllers: [NotificationController],

  providers: [NotificationService, NotificationRepository],

  exports: [NotificationService],
})
export class NotificationModule {}
