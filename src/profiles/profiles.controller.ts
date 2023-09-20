import {
  Controller,
  Post,
  Body,
  Get,
  Patch,
  Param,
  Delete,
  BadRequestException,
  UseGuards,
} from '@nestjs/common';
import { ProfilesService } from './profiles.service';
import { CreateProfileDto } from './dto/create-profile.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import { Profile } from './schema/profile.schema';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { JwtGuard } from 'src/auth/guards/jwtAuth.guards';

@UseGuards(JwtGuard)
@ApiTags('profiles')
@ApiBearerAuth()
@Controller('profiles')
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  @ApiOperation({
    summary: 'Создать новый профиль',
  })
  @ApiBody({ type: CreateProfileDto })
  @ApiCreatedResponse({
    description: 'Профиль успешно создан',
    type: Profile,
  })
  @ApiForbiddenResponse({ description: 'Отказ в доступе' })
  @ApiUnprocessableEntityResponse({ description: 'Неверный запрос' })
  @Post()
  create(@Body() createProfileDto: CreateProfileDto) {
    return this.profilesService.create(createProfileDto);
  }

  @ApiOkResponse({
    description: 'Профили успешно получены',
    type: [Profile],
  })
  @ApiForbiddenResponse({ description: 'Отказ в доступе' })
  @ApiNotFoundResponse({ description: 'Ресурс не найден' })
  @ApiOperation({
    summary: 'Получить все профили',
  })
  @Get()
  findAll(): Promise<Profile[]> {
    return this.profilesService.findAll();
  }

  @ApiOkResponse({
    description: 'Профиль успешно получен',
    type: Profile,
  })
  @ApiForbiddenResponse({ description: 'Отказ в доступе' })
  @ApiNotFoundResponse({ description: 'Ресурс не найден' })
  @ApiParam({
    name: 'id',
    description: 'Идентификатор профиля',
    example: '64f81ba37571bfaac18a857f',
  })
  @ApiOperation({
    summary: 'Получить профиль по id',
  })
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Profile> {
    const profile = await this.profilesService.findOne(id);
    if (!profile) throw new BadRequestException('Ресурс не найден');
    return profile;
  }

  @ApiOkResponse({
    description: 'Профиль успешно обновлен',
    type: Profile,
  })
  @ApiNotFoundResponse({ description: 'Ресурс не найден' })
  @ApiForbiddenResponse({ description: 'Отказ в доступе' })
  @ApiUnprocessableEntityResponse({ description: 'Неверный запрос' })
  @ApiBody({ type: UpdateProfileDto })
  @ApiParam({
    name: 'id',
    description: 'Идентификатор профиля',
    example: '64f81ba37571bfaac18a857f',
  })
  @ApiOperation({
    summary: 'Обновить данные профиля по id',
  })
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateProfileDto: UpdateProfileDto,
  ): Promise<Profile> {
    return this.profilesService.update(id, updateProfileDto);
  }

  @ApiOkResponse({
    description: 'Профиль успешно удален',
    type: Profile,
  })
  @ApiForbiddenResponse({ description: 'Отказ в доступе' })
  @ApiNotFoundResponse({ description: 'Ресурс не найден' })
  @ApiParam({
    name: 'id',
    description: 'Идентификатор профиля',
    example: '64f81ba37571bfaac18a857f',
  })
  @ApiOperation({
    summary: 'Удалить профиль по id',
  })
  @Delete(':id')
  remove(@Param('id') id: string): Promise<Profile> {
    return this.profilesService.remove(id);
  }
}
