import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Notification,
  NotificationSchema,
} from './entities/notification.schema';
import { ToWhom, ToWhomSchema } from './entities/toWhom.schema';
import { FromWhom, FromWhomSchema } from './entities/fromWhom.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Notification.name,
        schema: NotificationSchema,
      },

      {
        name: ToWhom.name,
        schema: ToWhomSchema,
      },

      {
        name: FromWhom.name,
        schema: FromWhomSchema,
      },
    ]),
  ],

  controllers: [],

  providers: [],

  exports: [],
})
export class NotificationModule {}
