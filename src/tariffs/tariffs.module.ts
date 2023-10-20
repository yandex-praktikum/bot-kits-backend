import { Module } from '@nestjs/common';
import { TariffsService } from './tariffs.service';
import { TariffsController } from './tariffs.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Tariff, TariffSchema } from './schema/tariff.schema';
import { ProfilesModule } from 'src/profiles/profiles.module';

@Module({
  imports: [
    ProfilesModule,
    MongooseModule.forFeature([{ name: Tariff.name, schema: TariffSchema }]),
  ],
  controllers: [TariffsController],
  providers: [TariffsService],
  exports: [TariffsService],
})
export class TariffsModule {}
