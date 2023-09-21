import {
  Controller,
  Post,
  Body,
  Delete,
  Param,
  Get,
  Patch,
  UseGuards,
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
  ApiParam,
  ApiUnprocessableEntityResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { JwtGuard } from 'src/auth/guards/jwtAuth.guards';

@ApiTags('tariffs')
@ApiBearerAuth()
@UseGuards(JwtGuard)
@Controller('tariffs')
export class TariffsController {
  constructor(private readonly tariffsService: TariffsService) {}

  @ApiOperation({
    summary: 'Получить все тарифы',
  })
  @ApiOkResponse({
    description: 'Тарифы успешно получены',
    type: [Tariff],
  })
  @ApiForbiddenResponse({ description: 'Отказ в доступе' })
  @Get()
  findAll() {
    return this.tariffsService.findAll();
  }

  @ApiOperation({
    summary: 'Получить тариф по id',
  })
  @ApiParam({
    name: 'id',
    description: 'Идентификатор тарифа',
    example: '64f81ba37571bfaac18a857f',
  })
  @ApiOkResponse({
    description: 'Тариф успешно получен',
    type: Tariff,
  })
  @ApiForbiddenResponse({ description: 'Отказ в доступе' })
  @ApiNotFoundResponse({ description: 'Ресурс не найден' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tariffsService.findOne(id);
  }

  @ApiOperation({
    summary: 'Добавить новый тариф',
  })
  @ApiBody({ type: CreateTariffDto })
  @ApiCreatedResponse({
    description: 'Тариф успешно добавлен',
    type: Tariff,
  })
  @ApiForbiddenResponse({ description: 'Отказ в доступе' })
  @ApiUnprocessableEntityResponse({ description: 'Неверный запрос' })
  @ApiConflictResponse({ description: 'Такой тариф уже существует' })
  @Post()
  create(@Body() CreateTariffDto: CreateTariffDto) {
    return this.tariffsService.create(CreateTariffDto);
  }

  @ApiOperation({
    summary: 'Изменить данные тарифа по id',
  })
  @ApiBody({ type: UpdateTariffDto })
  @ApiParam({
    name: 'id',
    description: 'Идентификатор тарифа',
    example: '64f81ba37571bfaac18a857f',
  })
  @ApiOkResponse({
    description: 'Тариф успешно изменен',
    type: Tariff,
  })
  @ApiForbiddenResponse({ description: 'Отказ в доступе' })
  @ApiNotFoundResponse({ description: 'Ресурс не найден' })
  @ApiUnprocessableEntityResponse({ description: 'Неверный запрос' })
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
  @ApiParam({
    name: 'id',
    description: 'Идентификатор тарифа',
    example: '64f81ba37571bfaac18a857f',
  })
  @ApiOkResponse({
    description: 'Тариф успешно удален',
    type: Tariff,
  })
  @ApiForbiddenResponse({ description: 'Отказ в доступе' })
  @ApiNotFoundResponse({ description: 'Ресурс не найден' })
  @Delete(':id')
  remove(@Param('id') id: string): Promise<Tariff> {
    return this.tariffsService.remove(id);
  }
}
