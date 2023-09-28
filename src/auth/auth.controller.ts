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
import { VkontakteGuard } from './guards/vkontakte.guards';

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
    private readonly authDtoPipe: AuthDtoPipe,
    private readonly configService: ConfigService,
  ) {}

  @UseGuards(LocalGuard)
  @Post('signin')
  @ApiOperation({
    summary: 'Войти в систему',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string', example: 'test@mail.ru' },
        password: { type: 'string', example: '123' },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Успешный вход в систему',
    schema: {
      type: 'object',
      properties: {
        _id: {
          type: 'string',
          description: 'Идентификатор',
          example: '650b396dd4201e5ca499f3b3',
        },
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
              _id: {
                type: 'string',
                description: 'Идентификатор аккаунта',
                example: '650b396ed4201e5ca499f3b5',
              },
              type: {
                type: 'string',
                description: 'Тип аккаунта',
                example: 'local',
              },
              role: {
                type: 'string',
                description: 'Роль аккаунта',
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
                    example:
                      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2NTBiMzk2ZGQ0MjAxZTVjYTQ5OWYzYjMiLCJpYXQiOjE2OTUyMzQ0MTQsImV4cCI6MTY5NTMyMDgxNH0.1GIu8iWeg8iWF-i5iynAhelc7kO3ouj09boZHjqn5HE',
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
                description: 'Идентификатор профиля',
                example: '650b396dd4201e5ca499f3b3',
              },
            },
          },
          description: 'Список аккаунтов',
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Неверное имя пользователя или пароль',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Неверное имя пользователя или пароль',
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
  async signin(@Req() req: RequestProfile): Promise<Profile> {
    return this.authService.auth(req.user);
  }

  @Post('signup')
  @ApiOperation({ summary: 'Регистрация' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        password: { type: 'string', example: '123' },
        email: { type: 'string', example: 'test@mail.ru' },
        phone: { type: 'string', example: '+79999999999' },
        username: { type: 'string', example: 'test' },
      },
    },
  })
  @ApiResponse({
    status: 201,
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
  @ApiResponse({ status: 400, description: 'Некорректные данные' })
  @ApiResponse({
    status: 409,
    description: 'Аккаунт уже существует',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Аккаунт уже существует',
          description: 'Сообщение об ошибке',
        },
        error: {
          type: 'string',
          example: 'Conflict',
          description: 'Тип ошибки',
        },
        statusCode: {
          type: 'number',
          example: '409',
          description: 'HTTP-статус код',
        },
      },
    },
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
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        refreshToken: {
          type: 'string',
          example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6Ikp',
        },
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
          example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6Ikp',
        },
        refreshToken: {
          type: 'string',
          description: 'refreshToken по умолчанию действует 7 дней',
          example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6Ikp',
        },
      },
    },
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
    summary: 'Авторизация через Вконтакте',
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
