import {
  Controller,
  Post,
  Body,
  Delete,
  Param,
  Get,
  Patch,
} from '@nestjs/common';
import { TariffsService } from './tariffs.service';
import { CreateTariffDto } from './dto/tariff.dto';
import { Tariff } from './entities/tariff.entity';
import { UpdateTariffDto } from './dto/updateTariff.dto';

@Controller('tariffs')
export class TariffsController {
  constructor(private readonly tariffsService: TariffsService) {}

  @Post()
  create(@Body() CreateTariffDto: CreateTariffDto) {
    return this.tariffsService.create(CreateTariffDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tariffsService.findOne(id);
  }

  @Get()
  findAll() {
    return this.tariffsService.findAll();
  }

  @Patch(':id')
  updateTariff(
    @Param('id') id: string,
    @Body() UpdateTariffDto: UpdateTariffDto,
  ) {
    return this.tariffsService.updateTariff(id, UpdateTariffDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<Tariff> {
    return this.tariffsService.remove(id);
  }
}
