import { Controller, Post, UseGuards, Req, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalGuard } from './guards/localAuth.guard';
import { Profile } from 'src/profiles/entities/profile.entity';
import { ProfilesService } from 'src/profiles/profiles.service';
import { CreateProfileDto } from 'src/profiles/dto/create-profile.dto';
import { ApiTags, ApiOperation, ApiBody, ApiResponse } from '@nestjs/swagger';

interface RequestProfile extends Request {
  user: Profile;
}

@ApiTags('auth')
@Controller()
export class AuthController {
  constructor(
    private profilesService: ProfilesService,
    private authService: AuthService,
  ) {}

  @ApiOperation({
    summary: 'Войти в систему',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        username: { type: 'string' },
        password: { type: 'string' },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Успешный вход в систему',
    schema: {
      type: 'object',
      properties: {
        accessToken: {
          type: 'string',
          description: 'accessToken по умолчанию действует 1 день',
        },
        refreshToken: {
          type: 'string',
          description: 'refreshToken по умолчанию действует 7 дней',
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Неверное имя пользователя или пароль',
  })
  @UseGuards(LocalGuard)
  @Post('signin')
  async signin(@Req() req: RequestProfile) {
    return this.authService.auth(req.user);
  }

  @ApiOperation({
    summary: 'Регистрация',
  })
  @ApiBody({ type: CreateProfileDto })
  @Post('signup')
  async signup(@Body() createProfileDto: CreateProfileDto) {
    const profile = await this.profilesService.create(createProfileDto);
    this.authService.auth(profile);
    delete profile.password;
    return profile;
  }

  @ApiOperation({
    summary: 'Обновить токен',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        refreshToken: { type: 'string' },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'accessToken успешно обновлен',
    schema: {
      type: 'object',
      properties: {
        accessToken: {
          type: 'string',
          description: 'accessToken по умолчанию действует 1 день',
        },
        refreshToken: {
          type: 'string',
          description: 'refreshToken по умолчанию действует 7 дней',
        },
      },
    },
  })
  @Post('refresh-token')
  async refreshToken(@Body('refreshToken') refreshToken: string) {
    return this.authService.refreshToken(refreshToken);
  }
}
