//scr/profiles/profiles.controller.ts
import {
  Controller,
  Post,
  Body,
  Get,
  Patch,
  Param,
  Delete,
  BadRequestException,
} from '@nestjs/common';
import { ProfilesService } from './profiles.service';
import { CreateProfileDto } from './dto/create-profile.dto';
import {
  ApiBody,
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

@ApiTags('profiles')
@Controller('profiles')
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}
  @ApiTags('profiles')
  @Post()
  @ApiOperation({ summary: 'Создать новый профиль' })
  @ApiBody({ type: CreateProfileDto })
  @ApiResponse({ status: 201, description: 'Профиль успешно создан' })
  @ApiResponse({ status: 400, description: 'Некорректные данные' })
  create(@Body() createProfileDto: CreateProfileDto) {
    return this.profilesService.create(createProfileDto);
  }

  @ApiOkResponse({
    description: 'The resources were returned successfully',
    type: [Profile],
  })
  @ApiForbiddenResponse({ description: 'Unauthorized Request' })
  @Get()
  findAll(): Promise<Profile[]> {
    return this.profilesService.findAll();
  }

  @ApiOkResponse({
    description: 'The resource was returned successfully',
    type: Profile,
  })
  @ApiForbiddenResponse({ description: 'Unauthorized Request' })
  @ApiNotFoundResponse({ description: 'Resource not found' })
  @ApiParam({
    name: 'id',
    description: 'Индификатор профиля',
    example: '64f81ba37571bfaac18a857f',
  })
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Profile> {
    const profile = await this.profilesService.findOne(id);
    if (!profile) throw new BadRequestException('Resource not found');
    return profile;
  }

  @ApiOkResponse({
    description: 'The resource was updated successfully',
    type: Profile,
  })
  @ApiNotFoundResponse({ description: 'Resource not found' })
  @ApiForbiddenResponse({ description: 'Unauthorized Request' })
  @ApiUnprocessableEntityResponse({ description: 'Bad Request' })
  @ApiBody({ type: UpdateProfileDto })
  @ApiParam({
    name: 'id',
    description: 'Индификатор профиля',
    example: '64f81ba37571bfaac18a857f',
  })
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateProfileDto: UpdateProfileDto,
  ): Promise<Profile> {
    return this.profilesService.update(id, updateProfileDto);
  }

  @ApiOkResponse({
    description: 'The resource was returned successfully',
    type: Profile,
  })
  @ApiForbiddenResponse({ description: 'Unauthorized Request' })
  @ApiNotFoundResponse({ description: 'Resource not found' })
  @ApiParam({
    name: 'id',
    description: 'Индификатор профиля',
    example: '64f81ba37571bfaac18a857f',
  })
  @Delete(':id')
  remove(@Param('id') id: string): Promise<Profile> {
    return this.profilesService.remove(id);
  }
}
