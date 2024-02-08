import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Delete,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';

import { PlatformService } from './platforms.service';
import { Platform } from './schema/platforms.schema';
import { CreatePlatformDto } from './dto/create-platform.dto';
import { UpdatePlatformDto } from './dto/update-platform.dto';
import { JwtGuard } from '../auth/guards/jwtAuth.guards';
import { CheckAbility } from 'src/auth/decorators/ability.decorator';
import { AbilityGuard } from 'src/auth/guards/ability.guard';
import { Action } from 'src/ability/ability.factory';

@UseGuards(JwtGuard)
@ApiTags('platforms')
@ApiBearerAuth()
@Controller('platforms')
export class PlatformController {
  constructor(private readonly platformService: PlatformService) {}

  @CheckAbility({ action: Action.Create, subject: CreatePlatformDto })
  @UseGuards(AbilityGuard)
  @Post()
  @ApiBody({ type: CreatePlatformDto })
  @ApiCreatedResponse({
    description: 'Платформа успешно создана',
    type: Platform,
  })
  @ApiForbiddenResponse({ description: 'Отказ в доступе' })
  @ApiBadRequestResponse({ description: 'Неверный запрос' })
  @ApiOperation({
    summary: 'Создать новую платформу',
  })
  create(@Body() createPlatformDto: CreatePlatformDto): Promise<Platform> {
    return this.platformService.create(createPlatformDto);
  }

  @CheckAbility({ action: Action.Read, subject: UpdatePlatformDto })
  @UseGuards(AbilityGuard)
  @Get()
  @ApiOkResponse({
    description: 'Платформы успешно получены',
    type: [Platform],
  })
  @ApiForbiddenResponse({ description: 'Отказ в доступе' })
  @ApiOperation({
    summary: 'Получить все платформы',
  })
  findAll(): Promise<Platform[]> {
    return this.platformService.findAll();
  }

  @CheckAbility({ action: Action.Read, subject: UpdatePlatformDto })
  @UseGuards(AbilityGuard)
  @Get(':id')
  @ApiOkResponse({
    description: 'Платформа успешно получена',
    type: Platform,
  })
  @ApiForbiddenResponse({ description: 'Отказ в доступе' })
  @ApiNotFoundResponse({ description: 'Ресурс не найден' })
  @ApiParam({
    name: 'id',
    description: 'Идентиификатор платформы',
    example: '64f81ba37571bfaac18a857f',
  })
  @ApiOperation({
    summary: 'Получить платформу по id',
  })
  async findOne(@Param('id') id: string): Promise<Platform> {
    return await this.platformService.findOne(id);
  }

  @CheckAbility({ action: Action.Update, subject: CreatePlatformDto })
  @UseGuards(AbilityGuard)
  @Patch(':id')
  @ApiOkResponse({
    description: 'Платформа успешно обновлена',
    type: Platform,
  })
  @ApiForbiddenResponse({ description: 'Отказ в доступе' })
  @ApiNotFoundResponse({ description: 'Ресурс не найден' })
  @ApiBadRequestResponse({ description: 'Неверный запрос' })
  @ApiBody({ type: UpdatePlatformDto })
  @ApiParam({
    name: 'id',
    description: 'Идентификатор платформы',
    example: '64f81ba37571bfaac18a857f',
  })
  @ApiOperation({
    summary: 'Обновить данные о платформе по id',
  })
  update(
    @Param('id') id: string,
    @Body() updatePlatformDto: UpdatePlatformDto,
  ): Promise<Platform> {
    return this.platformService.update(id, updatePlatformDto);
  }

  @CheckAbility({ action: Action.Delete, subject: CreatePlatformDto })
  @UseGuards(AbilityGuard)
  @Delete(':id')
  @ApiOkResponse({
    description: 'Платформа успешно удалена',
    type: Platform,
  })
  @ApiForbiddenResponse({ description: 'Отказ в доступе' })
  @ApiNotFoundResponse({ description: 'Ресурс не найден' })
  @ApiParam({
    name: 'id',
    description: 'Идентификатор платформы',
    example: '64f81ba37571bfaac18a857f',
  })
  @ApiOperation({
    summary: 'Удалить платформу по id',
  })
  remove(@Param('id') id: string): Promise<Platform> {
    return this.platformService.remove(id);
  }
}
