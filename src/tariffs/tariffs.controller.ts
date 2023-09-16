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
import { CreateTariffDto } from './dto/create-tariff.dto';
import { Tariff } from './schema/tariff.schema';
import { UpdateTariffDto } from './dto/update-tariff.dto';
import {
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiOkResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiCreatedResponse,
  ApiConflictResponse,
} from '@nestjs/swagger';

@ApiTags('tariffs')
@Controller('tariffs')
export class TariffsController {
  constructor(private readonly tariffsService: TariffsService) {}

  @ApiOperation({
    summary: 'Получить все тарифы',
  })
  @ApiOkResponse({
    description: 'The resources were returned successfully',
    type: [Tariff],
  })
  @ApiForbiddenResponse({ description: 'Unauthorized Request' })
  @ApiNotFoundResponse({ description: 'Нет ни одного тарифа' })
  @Get()
  findAll() {
    return this.tariffsService.findAll();
  }

  @ApiOperation({
    summary: 'Получить тариф по id',
  })
  @ApiOkResponse({
    description: 'The resources were returned successfully',
    type: Tariff,
  })
  @ApiForbiddenResponse({ description: 'Unauthorized Request' })
  @ApiNotFoundResponse({ description: 'Нет тарифа с таким id' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tariffsService.findOne(id);
  }

  @ApiOperation({
    summary: 'Добавить новый тариф',
  })
  @ApiBody({ type: CreateTariffDto })
  @ApiCreatedResponse({
    description: 'The resources were returned successfully',
    type: Tariff,
  })
  @ApiForbiddenResponse({ description: 'Unauthorized Request' })
  @ApiConflictResponse({ description: 'Такой тариф уже существует' })
  @Post()
  create(@Body() CreateTariffDto: CreateTariffDto) {
    return this.tariffsService.create(CreateTariffDto);
  }

  @ApiOperation({
    summary: 'Изменить данные тарифа по id',
  })
  @ApiBody({ type: UpdateTariffDto })
  @ApiOkResponse({
    description: 'The resources were returned successfully',
    type: Tariff,
  })
  @ApiForbiddenResponse({ description: 'Unauthorized Request' })
  @ApiNotFoundResponse({ description: 'Нет тарифа с таким id' })
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
  @ApiOkResponse({
    description: 'The resources were returned successfully',
    type: Tariff,
  })
  @ApiForbiddenResponse({ description: 'Unauthorized Request' })
  @ApiNotFoundResponse({ description: 'Нет тарифа с таким id' })
  @Delete(':id')
  remove(@Param('id') id: string): Promise<Tariff> {
    return this.tariffsService.remove(id);
  }
}
