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
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiHeader,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Profile } from './schema/profile.schema';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { JwtGuard } from 'src/auth/guards/jwtAuth.guards';
import { Account } from 'src/accounts/schema/account.schema';
import {
  AccountsDescription,
  AccountsNotFoundResponse,
  ProfileBadRequestResponse,
  ProfileUnauthirizedResponse,
  ResourceIsNotFound,
  SetSharedConflict,
  SetSharedDescription,
  SetSharedNotFound,
  SharedDescription,
  UserProfileResponseBodyOK,
  UserResponseBodyOK,
} from './sdo/response-body.sdo';
import { CreateSharedAccessDto } from './dto/create-access.dto';
import { CheckAbility } from 'src/auth/decorators/ability.decorator';
import { Action } from 'src/ability/ability.factory';
import { AbilityGuard } from 'src/auth/guards/ability.guard';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateSharedAccessDto } from './dto/update-access.dto';
import { TAllUsersResponse } from './profiles.repository';
import { UpdateProfile } from './sdo/request-body.sdo';

@UseGuards(JwtGuard)
@ApiTags('profiles')
@ApiBearerAuth()
@Controller('profiles')
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}
  @CheckAbility({ action: Action.Read, subject: CreateProfileDto })
  @UseGuards(AbilityGuard)
  @Get()
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Получить все профили',
  })
  @ApiOkResponse({
    description: 'Профили успешно получены',
    type: [UserProfileResponseBodyOK],
  })
  @ApiUnauthorizedResponse({
    description: 'Отказ в доступе',
    type: ProfileUnauthirizedResponse,
  })
  findAll(): Promise<TAllUsersResponse[]> {
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
    type: UserResponseBodyOK,
  })
  @ApiUnauthorizedResponse({
    description: 'Отказ в доступе',
    type: ProfileUnauthirizedResponse,
  })
  async findProfileByToken(@Headers('authorization') authHeader: string) {
    const token = authHeader.split(' ')[1];
    return await this.profilesService.findByToken(token);
  }

  @CheckAbility({ action: Action.Share, subject: UpdateProfileDto })
  @UseGuards(AbilityGuard)
  @Post('shared')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Выдать прова пользователю',
  })
  @ApiHeader({
    name: 'authorization',
    description: 'Access токен',
    required: true,
  })
  @ApiBody({
    type: CreateSharedAccessDto,
  })
  @ApiCreatedResponse({
    description: 'Права выданы успешно',
    type: SetSharedDescription,
  })
  @ApiUnauthorizedResponse({
    description: 'Отказ в доступе',
    type: ProfileUnauthirizedResponse,
  })
  @ApiNotFoundResponse({
    description: 'Профиль не найден',
    type: SetSharedNotFound,
  })
  @ApiConflictResponse({
    description: 'Доступ уже предоставлен',
    type: SetSharedConflict,
  })
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
    type: [SharedDescription],
  })
  @ApiUnauthorizedResponse({
    description: 'Отказ в доступе',
    type: ProfileUnauthirizedResponse,
  })
  async findAllGrantedAccesses(@Req() req) {
    return await this.profilesService.findAllGrantedAccesses(req.user.id);
  }

  @CheckAbility({ action: Action.Update, subject: UpdateProfileDto })
  @UseGuards(AbilityGuard)
  @Patch('shared')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Обновить выданный доступ',
  })
  @ApiHeader({
    name: 'authorization',
    description: 'Access токен',
    required: true,
  })
  @ApiBody({
    type: SharedDescription,
  })
  @ApiOkResponse({
    description: 'Профиль успешно обновлен',
    type: SharedDescription,
  })
  @ApiBadRequestResponse({
    description: 'Плохой запрос',
    type: ProfileBadRequestResponse,
  })
  @ApiUnauthorizedResponse({
    description: 'Отказ в доступе',
    type: ProfileUnauthirizedResponse,
  })
  updateAccesses(
    @Req() req,
    @Body() updateSharedAccessDto: UpdateSharedAccessDto,
  ): Promise<Profile> {
    return this.profilesService.updateAccesses(
      req.user.id,
      updateSharedAccessDto,
    );
  }

  @CheckAbility({ action: Action.Read, subject: CreateProfileDto })
  @UseGuards(AbilityGuard)
  @Get(':id')
  @ApiBearerAuth()
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
    type: UserResponseBodyOK,
  })
  @ApiBadRequestResponse({
    description: 'Неверный ID пользователя',
    type: ResourceIsNotFound,
  })
  @ApiUnauthorizedResponse({
    description: 'Отказ в доступе',
    type: ProfileUnauthirizedResponse,
  })
  async findOne(@Param('id') id: string): Promise<Profile> {
    const profile = await this.profilesService.findOne(id);
    if (!profile) throw new BadRequestException('Ресурс не найден');
    return profile;
  }

  @CheckAbility({ action: Action.Read, subject: CreateProfileDto })
  @UseGuards(AbilityGuard)
  @Get(':id/accounts')
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    description: 'Идентификатор профиля',
    example: '64f81ba37571bfaac18a857f',
  })
  @ApiOperation({
    summary: 'Получить все аккаунты пользователя по id профиля',
  })
  @ApiOkResponse({
    description: 'Аккаунты профиля успешно получены',
    type: [AccountsDescription],
  })
  @ApiUnauthorizedResponse({
    description: 'Отказ в доступе',
    type: ProfileUnauthirizedResponse,
  })
  @ApiNotFoundResponse({
    description: 'Неверный ID пользователя',
    type: AccountsNotFoundResponse,
  })
  async findAccountByProfileId(@Param('id') id: string): Promise<Account[]> {
    return await this.profilesService.findAccountsByProfileId(id);
  }

  @CheckAbility({ action: Action.Update, subject: UpdateProfileDto })
  @UseGuards(AbilityGuard)
  @Patch(':id')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Обновить данные профиля по id',
  })
  @ApiBody({ type: UpdateProfile })
  @ApiParam({
    name: 'id',
    description: 'Идентификатор профиля',
    example: '64f81ba37571bfaac18a857f',
  })
  @ApiOkResponse({
    description: 'Профиль успешно обновлен',
    type: UserResponseBodyOK,
  })
  @ApiUnauthorizedResponse({
    description: 'Отказ в доступе',
    type: ProfileUnauthirizedResponse,
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
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Удалить профиль по id',
  })
  @ApiParam({
    name: 'id',
    description: 'Идентификатор профиля',
    example: '64f81ba37571bfaac18a857f',
  })
  @ApiOkResponse({
    description: 'Профиль успешно удален',
    type: UserResponseBodyOK,
  })
  @ApiUnauthorizedResponse({
    description: 'Отказ в доступе',
    type: ProfileUnauthirizedResponse,
  })
  remove(@Param('id') id: string): Promise<Profile> {
    return this.profilesService.remove(id);
  }
}
