import { Module } from '@nestjs/common';
import { BotAccessesService } from './botAccesses.service';
import { BotAccessesController } from './botAccesses.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { BotAccess, BotAccessSchema } from './shema/botAccesses.shema';


@Module({
  imports: [
    MongooseModule.forFeature([{ name: BotAccess.name, schema: BotAccessSchema }]),
  ],
  controllers: [BotAccessesController],
  providers: [BotAccessesService],
  exports: [BotAccessesService],
})
export class BotAccessesModule {}
