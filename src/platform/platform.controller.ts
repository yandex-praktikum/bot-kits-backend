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
import { PlatformService } from './platform.service';
import { Platform } from './schema/platform.schema';
import { CreatePlatformDto } from './dto/create-platform.dto';
import { UpdatePlatformDto } from './dto/update-platform.dto';

@Controller('platforms')
export class PlatformController {
  constructor(private readonly platformService: PlatformService) {}

  @Post()
  create(@Body() createPlatformDto: CreatePlatformDto): Promise<Platform> {
    return this.platformService.create(createPlatformDto);
  }

  @Get()
  findAll(): Promise<Platform[]> {
    return this.platformService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Platform> {
    const platform = await this.platformService.findOne(id);
    if (!platform) throw new BadRequestException('Resource not found');
    return platform;
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePlatformDto: UpdatePlatformDto,
  ): Promise<Platform> {
    return this.platformService.update(id, updatePlatformDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<Platform> {
    return this.platformService.remove(id);
  }
}
