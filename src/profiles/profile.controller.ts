import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  BadRequestException,
} from '@nestjs/common';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';

import { ProfileService } from './profile.service';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { Profile } from './schema/profile.schema';

@ApiTags('Profiles')
@Controller('profiles')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @ApiBody({ type: CreateProfileDto })
  @ApiCreatedResponse({
    description: 'The record has been successfully created.',
    type: Profile,
  })
  @Post()
  create(@Body() createProfileDto: CreateProfileDto): Promise<Profile> {
    return this.profileService.create(createProfileDto);
  }

  @ApiOkResponse({
    description: 'The resources were returned successfully',
    type: [Profile],
  })
  @ApiForbiddenResponse({ description: 'Unauthorized Request' })
  @Get()
  findAll(): Promise<Profile[]> {
    return this.profileService.findAll();
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
    const profile = await this.profileService.findOne(id);
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
    return this.profileService.update(id, updateProfileDto);
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
    return this.profileService.remove(id);
  }
}
