import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { PromocodesService } from './promocodes.service';
import { CreatePromocodeDto } from './dto/create-promocode.dto';
import { UpdatePromocodeDto } from './dto/update-promocode.dto';
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
  ApiBearerAuth,
  ApiBadRequestResponse,
} from '@nestjs/swagger';
import { Promocode } from './schema/promocode.schema';

@ApiTags('promocodes')
@ApiBearerAuth()
@Controller('promocodes')
export class PromocodesController {
  constructor(private readonly promocodesService: PromocodesService) {}

  @ApiOperation({
    summary: 'Добавить новый промокод',
  })
  @ApiBody({ type: CreatePromocodeDto })
  @ApiCreatedResponse({
    description: 'Промокод успешно добавлен',
    type: Promocode,
  })
  @ApiForbiddenResponse({ description: 'Отказ в доступе' })
  @ApiConflictResponse({ description: 'Такой промокод уже существует' })
  @Post()
  create(@Body() createPromocodeDto: CreatePromocodeDto): Promise<Promocode> {
    return this.promocodesService.create(createPromocodeDto);
  }

  @ApiOperation({
    summary: 'Получить все промокоды',
  })
  @ApiOkResponse({
    description: 'Промокоды успешно получены',
    type: [Promocode],
  })
  @ApiForbiddenResponse({ description: 'Отказ в доступе' })
  @Get()
  findAll(): Promise<Promocode[]> {
    return this.promocodesService.findAll();
  }

  @ApiOperation({
    summary: 'Получить промокод по id',
  })
  @ApiParam({
    name: 'id',
    description: 'Идентификатор промокода',
    example: '64f81ba37571bfaac18a857f',
  })
  @ApiOkResponse({
    description: 'Промокод успешно получен',
    type: Promocode,
  })
  @ApiForbiddenResponse({ description: 'Отказ в доступе' })
  @ApiNotFoundResponse({ description: 'Ресурс не найден' })
  @Get(':id')
  findOne(@Param('id') id: string): Promise<Promocode> {
    return this.promocodesService.findOne(id);
  }

  @ApiOperation({
    summary: 'Изменить данные промокода по id',
  })
  @ApiBody({ type: UpdatePromocodeDto })
  @ApiParam({
    name: 'id',
    description: 'Идентификатор промокода',
    example: '64f81ba37571bfaac18a857f',
  })
  @ApiOkResponse({
    description: 'Данные промокода успешно изменены',
    type: Promocode,
  })
  @ApiForbiddenResponse({ description: 'Отказ в доступе' })
  @ApiNotFoundResponse({ description: 'Ресурс не найден' })
  @ApiBadRequestResponse({ description: 'Неверный запрос' })
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePromocodeDto: UpdatePromocodeDto,
  ): Promise<Promocode> {
    return this.promocodesService.update(id, updatePromocodeDto);
  }

  @ApiOperation({
    summary: 'Удалить промокод по id',
  })
  @ApiParam({
    name: 'id',
    description: 'Идентификатор промокода',
    example: '64f81ba37571bfaac18a857f',
  })
  @ApiOkResponse({
    description: 'Промокод успешно удален',
    type: Promocode,
  })
  @ApiForbiddenResponse({ description: 'Отказ в доступе' })
  @ApiNotFoundResponse({ description: 'Ресурс не найден' })
  @Delete(':id')
  remove(@Param('id') id: string): Promise<Promocode> {
    return this.promocodesService.remove(id);
  }
}
