import { Module } from '@nestjs/common';
import { MailingService } from './mailing.service';
import { MailingController } from './mailing.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Mailing, MailingSchema } from './schema/mailing.schema';
import { MailingRepository } from './mailing.repository';
import { Bot, BotSchema } from 'src/bots/schema/bots.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Mailing.name, schema: MailingSchema }]),
    MongooseModule.forFeature([{ name: Bot.name, schema: BotSchema }]),
  ],
  controllers: [MailingController],
  providers: [MailingService, MailingRepository],
  exports: [MailingService],
})
export class MailingModule {}
