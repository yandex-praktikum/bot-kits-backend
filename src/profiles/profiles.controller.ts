import {
  Controller,
  Body,
  Get,
  Patch,
  Param,
  Delete,
  BadRequestException,
  UseGuards,
  Headers,
  Post,
  Req,
} from '@nestjs/common';
import { ProfilesService } from './profiles.service';

import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiForbiddenResponse,
  ApiHeader,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { Access, Profile } from './schema/profile.schema';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { JwtGuard } from 'src/auth/guards/jwtAuth.guards';
import { Account } from 'src/accounts/schema/account.schema';
import { UserProfileResponseBodyOK } from './sdo/response-body.sdo';
import { SingleAccountResponseBodyOK } from 'src/accounts/sdo/response-body.sdo';
import { CreateSharedAccessDto } from './dto/create-access.dto';
import { CheckAbility } from 'src/auth/decorators/ability.decorator';
import { Action } from 'src/ability/ability.factory';
import { AbilityGuard } from 'src/auth/guards/ability.guard';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateSharedAccessDto } from './dto/update-access.dto';

@UseGuards(JwtGuard)
@ApiTags('profiles')
@ApiBearerAuth()
@Controller('profiles')
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}
  @CheckAbility({ action: Action.Read, subject: CreateProfileDto })
  @UseGuards(AbilityGuard)
  @Get()
  @ApiOkResponse({
    description: 'Профили успешно получены',
    type: [UserProfileResponseBodyOK],
  })
  @ApiForbiddenResponse({ description: 'Отказ в доступе' })
  @ApiNotFoundResponse({ description: 'Ресурс не найден' })
  @ApiOperation({
    summary: 'Получить все профили',
  })
  findAll(): Promise<Profile[]> {
    return this.profilesService.findAll();
  }

  @CheckAbility({ action: Action.Read, subject: UpdateProfileDto })
  @UseGuards(AbilityGuard)
  @Get('me')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Получить текущий профиль',
  })
  @ApiHeader({
    name: 'authorization',
    description: 'Access токен',
    required: true,
  })
  @ApiOkResponse({
    description: 'Профиль успешно получен',
    type: UserProfileResponseBodyOK,
  })
  @ApiForbiddenResponse({ description: 'Отказ в доступе' })
  @ApiNotFoundResponse({ description: 'Ресурс не найден' })
  async findProfileByToken(@Headers('authorization') authHeader: string) {
    const token = authHeader.split(' ')[1];
    return await this.profilesService.findByToken(token);
  }

  @CheckAbility({ action: Action.Share, subject: UpdateProfileDto })
  @UseGuards(AbilityGuard)
  @Post('shared')
  sharedAccess(
    @Body() createSharedAccessDto: CreateSharedAccessDto,
    @Req() req,
  ) {
    return this.profilesService.sharedAccess(
      createSharedAccessDto,
      req.user.id,
    );
  }

  @CheckAbility({ action: Action.Read, subject: UpdateProfileDto })
  @UseGuards(AbilityGuard)
  @Get('shared')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Получить все выданные доступы профиля',
  })
  @ApiHeader({
    name: 'authorization',
    description: 'Access токен',
    required: true,
  })
  @ApiOkResponse({
    description: 'Доступы успешно получены',
    type: [Access],
  })
  @ApiForbiddenResponse({ description: 'Отказ в доступе' })
  @ApiNotFoundResponse({ description: 'Ресурс не найден' })
  async findAllGrantedAccesses(@Req() req) {
    return await this.profilesService.findAllGrantedAccesses(req.user.id);
  }

  @CheckAbility({ action: Action.Update, subject: UpdateProfileDto })
  @UseGuards(AbilityGuard)
  @Patch('shared')
  @ApiOperation({
    summary: 'Обновить выданный доступ',
  })
  @ApiOkResponse({
    description: 'Профиль успешно обновлен',
    type: [Access],
  })
  @ApiNotFoundResponse({ description: 'Ресурс не найден' })
  @ApiForbiddenResponse({ description: 'Отказ в доступе' })
  @ApiBadRequestResponse({ description: 'Неверный запрос' })
  @ApiBody({ type: UpdateSharedAccessDto })
  @ApiOperation({
    summary: 'Обновить данные профиля по id',
  })
  updateAccesses(
    @Req() req,
    @Body() updateSharedAccessDto: UpdateSharedAccessDto,
  ): Promise<Profile> {
    return this.profilesService.updateAccesses(
      req.user.id,
      updateSharedAccessDto.access,
    );
  }

  @CheckAbility({ action: Action.Read, subject: CreateProfileDto })
  @UseGuards(AbilityGuard)
  @Get(':id')
  @ApiOperation({
    summary: 'Получить профиль по id',
  })
  @ApiParam({
    name: 'id',
    description: 'Идентификатор профиля',
    example: '64f81ba37571bfaac18a857f',
  })
  @ApiOkResponse({
    description: 'Профиль успешно получен',
    type: UserProfileResponseBodyOK,
  })
  @ApiForbiddenResponse({ description: 'Отказ в доступе' })
  @ApiNotFoundResponse({ description: 'Ресурс не найден' })
  async findOne(@Param('id') id: string): Promise<Profile> {
    const profile = await this.profilesService.findOne(id);
    if (!profile) throw new BadRequestException('Ресурс не найден');
    return profile;
  }

  @CheckAbility({ action: Action.Read, subject: CreateProfileDto })
  @UseGuards(AbilityGuard)
  @Get(':id/accounts')
  @ApiOkResponse({
    description: 'Аккаунты профиля успешно получены',
    type: [SingleAccountResponseBodyOK],
  })
  @ApiForbiddenResponse({ description: 'Отказ в доступе' })
  @ApiNotFoundResponse({ description: 'Ресурс не найден' })
  @ApiParam({
    name: 'id',
    description: 'Идентификатор профиля',
    example: '64f81ba37571bfaac18a857f',
  })
  @ApiOperation({
    summary: 'Получить все аккаунты пользователя по id профиля',
  })
  async findAccountByProfileId(@Param('id') id: string): Promise<Account[]> {
    return await this.profilesService.findAccountsByProfileId(id);
  }

  @CheckAbility({ action: Action.Update, subject: UpdateProfileDto })
  @UseGuards(AbilityGuard)
  @Patch(':id')
  @ApiOkResponse({
    description: 'Профиль успешно обновлен',
    type: UserProfileResponseBodyOK,
  })
  @ApiNotFoundResponse({ description: 'Ресурс не найден' })
  @ApiForbiddenResponse({ description: 'Отказ в доступе' })
  @ApiBadRequestResponse({ description: 'Неверный запрос' })
  @ApiBody({ type: UpdateProfileDto })
  @ApiParam({
    name: 'id',
    description: 'Идентификатор профиля',
    example: '64f81ba37571bfaac18a857f',
  })
  @ApiOperation({
    summary: 'Обновить данные профиля по id',
  })
  update(
    @Param('id') id: string,
    @Body() updateProfileDto: UpdateProfileDto,
  ): Promise<Profile> {
    return this.profilesService.update(id, updateProfileDto);
  }

  @CheckAbility({ action: Action.Delete, subject: UpdateProfileDto })
  @UseGuards(AbilityGuard)
  @Delete(':id')
  @ApiOkResponse({
    description: 'Профиль успешно удален',
    type: UserProfileResponseBodyOK,
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
  remove(@Param('id') id: string): Promise<Profile> {
    return this.profilesService.remove(id);
  }
}
