import { Module } from '@nestjs/common';
import { PromocodesService } from './promocodes.service';
import { PromocodesController } from './promocodes.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Promocode, PromocodeSchema } from './schema/promocode.schema';
import { ProfilesModule } from 'src/profiles/profiles.module';
import { PromocodesRepository } from './promocodes.repository';

@Module({
  imports: [
    ProfilesModule,
    MongooseModule.forFeature([
      { name: Promocode.name, schema: PromocodeSchema },
    ]),
  ],
  controllers: [PromocodesController],
  providers: [PromocodesService, PromocodesRepository],
  exports: [PromocodesService],
})
export class PromocodesModule {}
