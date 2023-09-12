import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Delete,
} from '@nestjs/common';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';

import { PlatformService } from './platforms.service';
import { Platform } from './schema/platforms.schema';
import { CreatePlatformDto } from './dto/create-platform.dto';
import { UpdatePlatformDto } from './dto/update-platform.dto';

@ApiTags('Platforms')
@Controller('platforms')
export class PlatformController {
  constructor(private readonly platformService: PlatformService) {}

  @ApiBody({ type: CreatePlatformDto })
  @ApiCreatedResponse({
    description: 'The record has been successfully created.',
    type: Platform,
  })
  @ApiOperation({
    summary: 'Создать новую платформу',
  })
  @Post()
  create(@Body() createPlatformDto: CreatePlatformDto): Promise<Platform> {
    return this.platformService.create(createPlatformDto);
  }

  @ApiOkResponse({
    description: 'The resources were returned successfully',
    type: [Platform],
  })
  @ApiForbiddenResponse({ description: 'Unauthorized Request' })
  @ApiOperation({
    summary: 'Получить все платформы',
  })
  @Get()
  findAll(): Promise<Platform[]> {
    return this.platformService.findAll();
  }

  @ApiOkResponse({
    description: 'The resource was returned successfully',
    type: Platform,
  })
  @ApiForbiddenResponse({ description: 'Unauthorized Request' })
  @ApiNotFoundResponse({ description: 'Resource not found' })
  @ApiParam({
    name: 'id',
    description: 'Индификатор платформы',
    example: '64f81ba37571bfaac18a857f',
  })
  @ApiOperation({
    summary: 'Получить платформу по id',
  })
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Platform> {
    const platform = await this.platformService.findOne(id);
    if (!platform) throw new BadRequestException('Resource not found');
    return platform;
  }

  @ApiOkResponse({
    description: 'The resource was updated successfully',
    type: Platform,
  })
  @ApiNotFoundResponse({ description: 'Resource not found' })
  @ApiForbiddenResponse({ description: 'Unauthorized Request' })
  @ApiUnprocessableEntityResponse({ description: 'Bad Request' })
  @ApiBody({ type: UpdatePlatformDto })
  @ApiParam({
    name: 'id',
    description: 'Индификатор платформы',
    example: '64f81ba37571bfaac18a857f',
  })
  @ApiOperation({
    summary: 'Обновить данные о платформе по id',
  })
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePlatformDto: UpdatePlatformDto,
  ): Promise<Platform> {
    return this.platformService.update(id, updatePlatformDto);
  }

  @ApiOkResponse({
    description: 'The resource was returned successfully',
    type: Platform,
  })
  @ApiForbiddenResponse({ description: 'Unauthorized Request' })
  @ApiNotFoundResponse({ description: 'Resource not found' })
  @ApiParam({
    name: 'id',
    description: 'Индификатор платформы',
    example: '64f81ba37571bfaac18a857f',
  })
  @ApiOperation({
    summary: 'Удалить платформу по id',
  })
  @Delete(':id')
  remove(@Param('id') id: string): Promise<Platform> {
    return this.platformService.remove(id);
  }
}
