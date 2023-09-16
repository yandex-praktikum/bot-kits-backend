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
} from '@nestjs/swagger';
import { Promocode } from './schema/promocode.schema';

@ApiTags('Promocodes')
@Controller('promocodes')
export class PromocodesController {
  constructor(private readonly promocodesService: PromocodesService) {}

  @ApiOperation({
    summary: 'Добавить новый промокод',
  })
  @ApiBody({ type: CreatePromocodeDto })
  @ApiCreatedResponse({
    description: 'The resources were returned successfully',
    type: Promocode,
  })
  @ApiForbiddenResponse({ description: 'Unauthorized Request' })
  @ApiConflictResponse({ description: 'Такой промокод уже существует' })
  @Post()
  create(@Body() createPromocodeDto: CreatePromocodeDto) {
    return this.promocodesService.create(createPromocodeDto);
  }

  @ApiOperation({
    summary: 'Получить все промокоды',
  })
  @ApiOkResponse({
    description: 'The resources were returned successfully',
    type: [Promocode],
  })
  @ApiForbiddenResponse({ description: 'Unauthorized Request' })
  @ApiNotFoundResponse({ description: 'Нет ни одного промокода' })
  @Get()
  findAll() {
    return this.promocodesService.findAll();
  }

  @ApiOperation({
    summary: 'Получить промокод по id',
  })
  @ApiOkResponse({
    description: 'The resources were returned successfully',
    type: Promocode,
  })
  @ApiForbiddenResponse({ description: 'Unauthorized Request' })
  @ApiNotFoundResponse({ description: 'Нет промокода с таким id' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.promocodesService.findOne(id);
  }

  @ApiOperation({
    summary: 'Изменить данные промокода по id',
  })
  @ApiBody({ type: UpdatePromocodeDto })
  @ApiOkResponse({
    description: 'The resources were returned successfully',
    type: Promocode,
  })
  @ApiForbiddenResponse({ description: 'Unauthorized Request' })
  @ApiNotFoundResponse({ description: 'Нет промокода с таким id' })
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePromocodeDto: UpdatePromocodeDto,
  ) {
    return this.promocodesService.update(id, updatePromocodeDto);
  }

  @ApiOperation({
    summary: 'Удалить промокод по id',
  })
  @ApiOkResponse({
    description: 'The resources were returned successfully',
    type: Promocode,
  })
  @ApiForbiddenResponse({ description: 'Unauthorized Request' })
  @ApiNotFoundResponse({ description: 'Нет промокода с таким id' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.promocodesService.remove(id);
  }
}
