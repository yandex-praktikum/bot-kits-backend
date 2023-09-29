import { Controller, Post, UseGuards, Req, Body, Get } from '@nestjs/common';
import { Request } from 'express';
import { LocalGuard } from './guards/localAuth.guard';
import {
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiExcludeEndpoint,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiUnauthorizedResponse,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiConflictResponse,
} from '@nestjs/swagger';
import { Profile, ProfileDocument } from 'src/profiles/schema/profile.schema';
import { AuthService, ITokens } from './auth.service';
import { AuthDtoPipe } from './pipe/auth-dto.pipe';
import { HttpService } from '@nestjs/axios';
import { CombinedDto } from './dto/combined.dto';
import TypeAccount from 'src/accounts/types/type-account';
import { GoogleGuard } from './guards/google.guard';
import {
  RefreshTokenRequestBody,
  ResetPasswordRequestBody,
  SigninRequestBody,
  SignupRequestBody,
} from './dto/request-body.dto';
import {
  ResetPasswordResponseBodyNotFound,
  ResetPasswordResponseBodyOK,
  SigninResponseBodyNotOK,
  SigninResponseBodyOK,
  SignupResponseBodyNotOK,
  refreshTokenResponseBodyNotOK,
  refreshTokenResponseBodyOK,
} from './dto/response-body.dto';
import { VkontakteGuard } from './guards/vkontakte.guards';
import { Account } from 'src/accounts/schema/account.schema';

interface RequestProfile extends Request {
  user: ProfileDocument;
}

@ApiTags('auth')
@Controller()
export class AuthController {
  constructor(
    private httpService: HttpService,
    private authService: AuthService,
    private readonly authDtoPipe: AuthDtoPipe,
  ) {}

  @UseGuards(LocalGuard)
  @Post('signin')
  @ApiOperation({
    summary: 'Войти в систему',
  })
  @ApiBody({ type: SigninRequestBody })
  @ApiCreatedResponse({
    description: 'Успешный вход в систему',
    type: SigninResponseBodyOK,
  })
  @ApiUnauthorizedResponse({
    description: 'Неверное имя пользователя или пароль',
    type: SigninResponseBodyNotOK,
  })
  async signin(@Req() req: RequestProfile): Promise<Account> {
    return this.authService.auth(req.user);
  }

  @Post('signup')
  @ApiOperation({ summary: 'Регистрация' })
  @ApiBody({ type: SignupRequestBody })
  @ApiCreatedResponse({
    description: 'Успешная регистрация',
    type: SigninResponseBodyOK,
  })
  @ApiBadRequestResponse({ description: 'Некорректные данные' })
  @ApiConflictResponse({
    description: 'Аккаунт уже существует',
    type: SignupResponseBodyNotOK,
  })
  async signup(@Body() combinedDto: CombinedDto): Promise<Account> {
    const newAccount: CombinedDto = {
      email: combinedDto.email,
      password: combinedDto.password,
      username: combinedDto.username,
      phone: combinedDto.phone,
      avatar: combinedDto.avatar,
    };
    const authDto = this.authDtoPipe.transform(newAccount, {
      type: 'body',
      data: 'combinedDto',
    });
    return await this.authService.registration(authDto);
  }

  @Post('refresh-token')
  @ApiOperation({
    summary: 'Обновить токен',
  })
  @ApiBody({ type: RefreshTokenRequestBody })
  @ApiCreatedResponse({
    description: 'accessToken успешно обновлен',
    type: refreshTokenResponseBodyOK,
  })
  @ApiUnauthorizedResponse({
    description: 'Невалидный refreshToken',
    type: refreshTokenResponseBodyNotOK,
  })
  async refreshToken(
    @Body('refreshToken') refreshToken: string,
  ): Promise<ITokens> {
    return this.authService.refreshToken(refreshToken);
  }

  @ApiOperation({
    summary: 'Авторизация через Yandex',
  })
  @ApiCreatedResponse({
    description: 'Успешная регистрация',
    type: SigninResponseBodyOK,
  })
  @Post('yandex/exchange')
  async exchangeCode(@Body('codeAuth') codeAuth: string) {
    const userData = await this.authService.authYandex(codeAuth);
    const newAccount: CombinedDto = {
      email: userData.data.default_email,
      password: '',
      username: userData.data.real_name || userData.data.first_name,
      phone: userData.data.default_phone.number,
      avatar: '',
    };
    const authDto = this.authDtoPipe.transform(newAccount, {
      type: 'body',
      data: 'combinedDto',
    });
    return await this.authService.authSocial(authDto, TypeAccount.YANDEX);
  }

  @ApiOperation({
    summary: 'Авторизация через Вконтакте',
  })
  @ApiOkResponse({
    description: 'Успешная регистрация',
    schema: {
      type: 'object',
      properties: {
        username: {
          type: 'string',
          description: 'Имя пользователя',
          example: 'test',
        },
        phone: {
          type: 'string',
          description: 'Номер телефона',
          example: '+79999999999',
        },
        avatar: {
          type: 'string',
          description: 'URL аватара',
          example: 'https://i.pravatar.cc/300',
        },
        balance: {
          type: 'number',
          description: 'Баланс',
          example: 0,
        },
        accounts: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              type: {
                type: 'string',
                description: 'Тип аккаунта',
                example: 'vk',
              },
              role: {
                type: 'string',
                description: 'Роль',
                example: 'user',
              },
              credentials: {
                type: 'object',
                properties: {
                  email: {
                    type: 'string',
                    description: 'Email',
                    example: 'test@mail.ru',
                  },
                  accessToken: {
                    type: 'string',
                    description: 'AccessToken',
                    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6Ikp',
                  },
                  refreshToken: {
                    type: 'string',
                    description: 'RefreshToken',
                    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6Ikp',
                  },
                },
              },
              profile: {
                type: 'string',
                description: 'Идентификатор профиля ',
                example: '650b396dd4201e5ca499f3b3',
              },
              _id: {
                type: 'string',
                description: 'Идентификатор аккаунта',
                example: '650b396dd4201e5ca499f3b3',
              },
            },
          },
          description: 'Список аккаунтов',
        },
        _id: {
          type: 'string',
          description: 'Идентификатор профиля',
          example: '650b396dd4201e5ca499f3b3',
        },
      },
    },
  })
  @UseGuards(VkontakteGuard)
  @Get('vkontakte')
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  vkontakteAuth() {}

  @ApiExcludeEndpoint(true)
  @UseGuards(VkontakteGuard)
  @Get('vkontakte/callback')
  async vkontakteCallback(@Req() req: any) {
    const { email, username, avatar } = req.user.profile;
    const newAccount: CombinedDto = {
      email,
      password: '',
      username,
      phone: ' ',
      avatar,
    };

    const authDto = this.authDtoPipe.transform(newAccount, {
      type: 'body',
      data: 'combinedDto',
    });
    return this.authService.authSocial(authDto, TypeAccount.VK);
  }

  @ApiOperation({
    summary: 'Авторизация через Google',
  })
  @ApiOkResponse({
    description: 'Успешная регистрация',
    type: SigninResponseBodyOK,
  })
  @UseGuards(GoogleGuard)
  @Get('google')
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  googleAuth() {}

  @ApiExcludeEndpoint(true)
  @UseGuards(GoogleGuard)
  @Get('google/callback')
  async googleCallback(@Req() req: any) {
    const { email, username, avatar } = req.user;
    const newAccount: CombinedDto = {
      email,
      password: '',
      username,
      phone: ' ',
      avatar,
    };
    const authDto = this.authDtoPipe.transform(newAccount, {
      type: 'body',
      data: 'combinedDto',
    });
    return this.authService.authSocial(authDto, TypeAccount.GOOGLE);
  }

  @Post('reset-password')
  @ApiOperation({
    summary: 'Сброс пароля',
  })
  @ApiBody({
    type: ResetPasswordRequestBody,
  })
  @ApiCreatedResponse({
    type: ResetPasswordResponseBodyOK,
    description: 'Ссылка для сброса пароля отправлена на указанный Email',
  })
  @ApiBadRequestResponse({
    description: 'Некорректные данные',
  })
  @ApiNotFoundResponse({
    type: ResetPasswordResponseBodyNotFound,
    description: 'Пользователь с указанным Email не найден',
  })
  async resetPassword(@Body('email') email: string) {
    return await this.authService.sendPasswordResetEmail(email);
  }
}
