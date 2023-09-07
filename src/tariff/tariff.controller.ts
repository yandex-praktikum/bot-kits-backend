import { Controller, Post, Body, Delete, Param } from '@nestjs/common';
import { TariffService } from './tariff.service';
import { CreateTariffDto } from './dto/tariff.dto';
import { Tariff } from './entities/tariff.entity';

@Controller('tariff')
export class TariffController {
  constructor(private readonly tariffService: TariffService) {}

  @Post()
  create(@Body() CreateTariffDto: CreateTariffDto) {
    return this.tariffService.create(CreateTariffDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<Tariff> {
    return this.tariffService.remove(id);
  }
}
