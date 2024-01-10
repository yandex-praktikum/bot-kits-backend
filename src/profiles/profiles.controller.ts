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
import { Profile } from './schema/profile.schema';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { JwtGuard } from 'src/auth/guards/jwtAuth.guards';
import { Account } from 'src/accounts/schema/account.schema';
import { UserProfileResponseBodyOK } from './sdo/response-body.sdo';
import { SingleAccountResponseBodyOK } from 'src/accounts/sdo/response-body.sdo';
import { RolesGuard } from 'src/auth/guards/role.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { CreateSharedAccessDto } from './dto/create-access.dto';

@UseGuards(JwtGuard)
@ApiTags('profiles')
@ApiBearerAuth()
@Controller('profiles')
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}
  @UseGuards(RolesGuard)
  @Roles('admin')
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

  @UseGuards(RolesGuard)
  @Roles('admin')
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
}
