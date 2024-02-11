import { Module, forwardRef } from '@nestjs/common';
import { TariffsService } from './tariffs.service';
import { TariffsController } from './tariffs.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Tariff, TariffSchema } from './schema/tariff.schema';
import { ProfilesModule } from 'src/profiles/profiles.module';
import { TariffsRepository } from './tariffs.repository';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Tariff.name, schema: TariffSchema }]),
    ProfilesModule,
  ],
  controllers: [TariffsController],
  providers: [TariffsService, TariffsRepository],
  exports: [TariffsService],
})
export class TariffsModule {}
