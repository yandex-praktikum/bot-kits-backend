import { Module } from '@nestjs/common';
import { AbilityFactory } from './ability.factory';

@Module({
  providers: [AbilityFactory],
  exports: [AbilityFactory], // Экспорт AbilityFactory
})
export class AbilityModule {}
