import { Module } from '@nestjs/common';
import { PromocodeService } from './promocode.service';
import { PromocodeController } from './promocode.controller';

@Module({
  controllers: [PromocodeController],
  providers: [PromocodeService],
})
export class PromocodeModule {}
