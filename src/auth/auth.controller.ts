import {
  Controller,
  Post,
  UseGuards,
  Req,
  Body,
  Get,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { LocalGuard } from './guards/localAuth.guard';
import {
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiResponse,
  ApiExcludeEndpoint,
} from '@nestjs/swagger';
import { Profile, ProfileDocument } from 'src/profiles/schema/profile.schema';
import { AuthService, ITokens } from './auth.service';
import { AuthDtoPipe } from './pipe/auth-dto.pipe';
import { HttpService } from '@nestjs/axios';
import { CombinedDto } from './dto/combined.dto';
import TypeAccount from 'src/accounts/types/type-account';
import { GoogleGuard } from './guards/google.guard';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import {
  RefreshTokenRequestBody,
  SigninRequestBody,
  SignupRequestBody,
} from './dto/request-body.dto';
import {
  SigninResponseBodyNotOK,
  SigninResponseBodyOK,
  SignupResponseBodyNotOK,
  refreshTokenResponseBodyOK,
} from './dto/response-body.dto';

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
    private readonly configService: ConfigService,
  ) {}

  @UseGuards(LocalGuard)
  @Post('signin')
  @ApiOperation({
    summary: 'Войти в систему',
  })
  @ApiBody({ type: SigninRequestBody })
  @ApiResponse({
    status: 201,
    description: 'Успешный вход в систему',
    type: SigninResponseBodyOK,
  })
  @ApiResponse({
    status: 401,
    description: 'Неверное имя пользователя или пароль',
    type: SigninResponseBodyNotOK,
  })
  async signin(@Req() req: RequestProfile): Promise<Profile> {
    return this.authService.auth(req.user);
  }

  @Post('signup')
  @ApiOperation({ summary: 'Регистрация' })
  @ApiBody({ type: SignupRequestBody })
  @ApiResponse({
    status: 201,
    description: 'Успешная регистрация',
    type: SigninResponseBodyOK,
  })
  @ApiResponse({ status: 400, description: 'Некорректные данные' })
  @ApiResponse({
    status: 409,
    description: 'Аккаунт уже существует',
    type: SignupResponseBodyNotOK,
  })
  async signup(@Body() combinedDto: CombinedDto): Promise<Profile> {
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
  @ApiResponse({
    status: 201,
    description: 'accessToken успешно обновлен',
    type: refreshTokenResponseBodyOK,
  })
  @ApiResponse({
    status: 401,
    description: 'Невалидный refreshToken',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Невалидный refreshToken',
          description: 'Сообщение об ошибке',
        },
        error: {
          type: 'string',
          example: 'Unauthorized',
          description: 'Тип ошибки',
        },
        statusCode: {
          type: 'number',
          example: '401',
          description: 'HTTP-статус код',
        },
      },
    },
  })
  async refreshToken(
    @Body('refreshToken') refreshToken: string,
  ): Promise<ITokens> {
    return this.authService.refreshToken(refreshToken);
  }

  @ApiOperation({
    summary: 'Авторизация через Yandex',
  })
  @ApiResponse({
    status: 200,
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
                example: 'local',
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
  @Post('yandex/exchange')
  async exchangeCode(@Body('codeAuth') codeAuth: string) {
    const CLIENT_ID = this.configService.get('YANDEX_APP_ID');
    const CLIENT_SECRET = this.configService.get('YANDEX_APP_SECRET');
    const TOKEN_URL = 'https://oauth.yandex.ru/token';
    const USER_INFO_URL = 'https://login.yandex.ru/info?format=json';

    try {
      const tokenResponse = await axios.post(
        TOKEN_URL,
        `grant_type=authorization_code&code=${codeAuth}`,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: `Basic ${Buffer.from(
              `${CLIENT_ID}:${CLIENT_SECRET}`,
            ).toString('base64')}`,
          },
        },
      );
      const accessToken = tokenResponse.data.access_token;

      const userDataResponse = await axios.get(
        `${USER_INFO_URL}&oauth_token=${accessToken}`,
      );
      const newAccount: CombinedDto = {
        email: userDataResponse.data.default_email,
        password: '',
        username:
          userDataResponse.data.real_name || userDataResponse.data.first_name,
        phone: userDataResponse.data.default_phone.number,
        avatar: '',
      };
      const authDto = this.authDtoPipe.transform(newAccount, {
        type: 'body',
        data: 'combinedDto',
      });
      return this.authService.authSocial(authDto, TypeAccount.YANDEX);
    } catch (error) {
      throw new HttpException(
        'Ошибка в процессе авторизации через Яндекс',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @ApiOperation({
    summary: 'Авторизация через Google',
  })
  @ApiResponse({
    status: 200,
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
                example: 'local',
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
    schema: {
      type: 'object',
      properties: {
        email: {
          type: 'string',
          description: 'Email пользователя',
          example: 'test@mail.ru',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example:
            'Ссылка на сброс пароля отправлена на ваш email: test@mail.ru',
          description: 'Email пользователя',
        },
      },
    },
    description: 'Ссылка для сброса пароля отправлена на указанный Email',
  })
  @ApiResponse({
    status: 400,
    description: 'Некорректные данные',
  })
  @ApiResponse({
    status: 404,
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Пользователь с указанным Email не найден',
          description: 'Сообщение об ошибке',
        },
        error: {
          type: 'string',
          example: 'Not Found',
          description: 'Тип ошибки',
        },
        statusCode: {
          type: 'number',
          example: '404',
          description: 'HTTP-статус код',
        },
      },
    },
    description: 'Пользователь с указанным Email не найден',
  })
  async resetPassword(@Body('email') email: string) {
    return await this.authService.sendPasswordResetEmail(email);
  }
}
