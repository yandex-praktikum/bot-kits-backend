import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Notification,
  NotificationSchema,
} from './schema/notifications.schema';
import { NotificationController } from './notifications.controller';
import { NotificationService } from './notifications.service';
import { ProfilesModule } from 'src/profiles/profiles.module';

@Module({
  imports: [
    ProfilesModule,
    MongooseModule.forFeature([
      {
        name: Notification.name,
        schema: NotificationSchema,
      },
    ]),
  ],

  controllers: [NotificationController],

  providers: [NotificationService],

  exports: [NotificationService],
})
export class NotificationModule {}
