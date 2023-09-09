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
import { ApiTags, ApiOperation, ApiBody, ApiResponse } from '@nestjs/swagger';

@ApiTags('tariffs')
@Controller('tariffs')
export class TariffsController {
  constructor(private readonly tariffsService: TariffsService) {}

  @ApiOperation({
    summary: 'Получить все тарифы',
  })
  @ApiResponse({
    status: 200,
    description: 'Будет получен массив тарифов',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          price: { type: 'number' },
          created_at: { type: 'string' },
          updated_at: { type: 'string' },
        },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Нет ни одного тарифа',
  })
  @Get()
  findAll() {
    return this.tariffsService.findAll();
  }

  @ApiOperation({
    summary: 'Получить тариф по id',
  })
  @ApiResponse({
    status: 200,
    description: 'Будет получен конкретный тариф по id',
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        price: { type: 'number' },
        created_at: { type: 'string' },
        updated_at: { type: 'string' },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Нет тарифа с таким id',
  })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tariffsService.findOne(id);
  }

  @ApiOperation({
    summary: 'Добавить новый тариф',
  })
  @ApiResponse({
    status: 200,
    description: 'Будет добавлен новый тариф',
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        price: { type: 'number' },
        created_at: { type: 'string' },
        updated_at: { type: 'string' },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Нет тарифа с таким id',
  })
  @Post()
  create(@Body() CreateTariffDto: CreateTariffDto) {
    return this.tariffsService.create(CreateTariffDto);
  }

  @ApiOperation({
    summary: 'Изменить данные тарифа по id',
  })
  @ApiResponse({
    status: 200,
    description: 'Будет изменен тариф с указанным id',
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        price: { type: 'number' },
        created_at: { type: 'string' },
        updated_at: { type: 'string' },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Такого тарифа нет',
  })
  @Patch(':id')
  updateTariff(
    @Param('id') id: string,
    @Body() UpdateTariffDto: UpdateTariffDto,
  ) {
    return this.tariffsService.updateTariff(id, UpdateTariffDto);
  }

  @ApiOperation({
    summary: 'Удалить тариф по id',
  })
  @ApiResponse({
    status: 200,
    description: 'Будет удален тариф с указанным id',
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        price: { type: 'number' },
        created_at: { type: 'string' },
        updated_at: { type: 'string' },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Такого тарифа нет',
  })
  @Delete(':id')
  remove(@Param('id') id: string): Promise<Tariff> {
    return this.tariffsService.remove(id);
  }
}
