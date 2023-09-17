import {
  Controller,
  Post,
  UseGuards,
  Req,
  Body,
  Get,
  Res,
  Query,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { LocalGuard } from './guards/localAuth.guard';
import { ApiTags, ApiOperation, ApiBody, ApiResponse } from '@nestjs/swagger';
import { AuthDto } from './dto/auth.dto';
import { ProfileDocument } from 'src/profiles/schema/profile.schema';
import { AuthService } from './auth.service';
import { AuthDtoPipe } from './pipe/auth-dto.pipe';
import { CreateProfileDto } from 'src/profiles/dto/create-profile.dto';
import { YandexGuard } from './guards/yandex.guards';
import { HttpService } from '@nestjs/axios';
import { map, mergeMap, tap } from 'rxjs';
import TypeAccount from 'src/accounts/types/type-account';
import Role from 'src/accounts/types/role';

interface RequestProfile extends Request {
  user: ProfileDocument;
}

interface IYandexUser {
  id: string;
  displayName: string;
  email: string;
  picture: string;
  accessToken: string;
}

interface IRequestYandexUser extends Request {
  user: IYandexUser;
}

@ApiTags('auth')
@Controller()
export class AuthController {
  constructor(
    private httpService: HttpService,
    private authService: AuthService,
  ) {}

  @ApiOperation({
    summary: 'Войти в систему',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string' },
        password: { type: 'string' },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Успешный вход в систему',
    type: CreateProfileDto,
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

  @ApiOperation({ summary: 'Регистрация' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        accountDto: {
          type: 'object',
          properties: {
            credentials: {
              type: 'object',
              properties: {
                password: { type: 'string' },
                email: { type: 'string' },
              },
            },
          },
        },
        profileDto: {
          type: 'object',
          properties: {
            phone: { type: 'string' },
            username: { type: 'string' },
          },
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Успешная регистрация' })
  @ApiResponse({
    status: 201,
    description: 'Успешная регистрация',
    type: CreateProfileDto,
  })
  @ApiResponse({ status: 400, description: 'Некорректные данные' })
  @ApiResponse({ status: 409, description: 'Аккаунт уже существует' })
  @Post('signup')
  async signup(@Body(new AuthDtoPipe()) authDto: AuthDto) {
    return await this.authService.registration(authDto);
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

  @UseGuards(YandexGuard)
  @Get('yandex')
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  yandexAuth() {}

  @UseGuards(YandexGuard)
  @Get('yandex/callback')
  async yandexCallback(@Req() req: IRequestYandexUser, @Res() res: Response) {
    const token = req.user['accessToken'];
    return res.redirect(`http://localhost:3000/yandex/success?token=${token}`);
  }

  @Get('yandex/success')
  async yandexSuccess(@Query('token') token: string) {
    return this.httpService
      .get(`https://login.yandex.ru/info?format=json&oauth_token=${token}`)
      .pipe(
        map(({ data }) => {
          const newAccount = {
            email: data.display_name,
            password: '',
            username: data.default_email,
            phone: data.default_phone.number,
            avatar: data.default_avatar_id,
          };

          // return await this.authService.authSocial(newAccount);
          return newAccount;
        }),
      );
  }
}
