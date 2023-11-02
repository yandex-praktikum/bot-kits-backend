import { Module } from '@nestjs/common';
import { PartnershipService } from './partnership.service';
import { PartnershipController } from './partnership.controller';
import { ProfilesModule } from 'src/profiles/profiles.module';

@Module({
  imports: [ProfilesModule],
  controllers: [PartnershipController],
  providers: [PartnershipService],
  exports: [PartnershipService],
})
export class PartnershipModule {}
