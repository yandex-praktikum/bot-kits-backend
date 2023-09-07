import { Module } from '@nestjs/common';
import { TariffService } from './tariff.service';
import { TariffController } from './tariff.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Tariff, TariffSchema } from './entities/tariff.entity';
import { HashService } from 'src/hash/hash.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Tariff.name, schema: TariffSchema }]),
  ],
  controllers: [TariffController],
  providers: [TariffService, HashService],
  exports: [TariffService],
})
export class TariffModule {}
