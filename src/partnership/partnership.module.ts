import { Module } from '@nestjs/common';
import { PartnershipService } from './partnership.service';
import { PartnershipController } from './partnership.controller';
import { ProfilesModule } from 'src/profiles/profiles.module';
import { PaymentsModule } from 'src/payments/payments.module';

@Module({
  imports: [ProfilesModule, PaymentsModule],
  controllers: [PartnershipController],
  providers: [PartnershipService],
  exports: [PartnershipService],
})
export class PartnershipModule {}
