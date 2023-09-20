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
import { Profile, ProfileDocument } from 'src/profiles/schema/profile.schema';
import { AuthService, ITokens } from './auth.service';
import { AuthDtoPipe } from './pipe/auth-dto.pipe';
import { YandexGuard } from './guards/yandex.guards';
import { HttpService } from '@nestjs/axios';
import { map, mergeMap } from 'rxjs';
import { CombinedDto } from './dto/combined.dto';
import TypeAccount from 'src/accounts/types/type-account';
import { GoogleGuard } from './guards/google.guard';

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
        email: { type: 'string' },
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
        _id: {
          type: 'string',
          description: 'Идентификатор',
        },
        username: {
          type: 'string',
          description: 'Имя пользователя',
        },
        phone: {
          type: 'string',
          description: 'Номер телефона',
        },
        avatar: {
          type: 'string',
          description: 'URL аватара',
        },
        balance: {
          type: 'number',
          description: 'Баланс',
        },
        accounts: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              _id: {
                type: 'string',
                description: 'Идентификатор аккаунта',
              },
              type: {
                type: 'string',
                description: 'Тип аккаунта',
              },
              role: {
                type: 'string',
                description: 'Роль аккаунта',
              },
              credentials: {
                type: 'object',
                properties: {
                  email: {
                    type: 'string',
                    description: 'Email',
                  },
                  accessToken: {
                    type: 'string',
                    description: 'AccessToken',
                  },
                  refreshToken: {
                    type: 'string',
                    description: 'RefreshToken',
                  },
                },
              },
              profile: {
                type: 'string',
                description: 'Идентификатор профиля',
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
        password: { type: 'string' },
        email: { type: 'string' },
        phone: { type: 'string' },
        username: { type: 'string' },
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
        },
        phone: {
          type: 'string',
          description: 'Номер телефона',
        },
        avatar: {
          type: 'string',
          description: 'URL аватара',
        },
        balance: {
          type: 'number',
          description: 'Баланс',
        },
        accounts: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              type: {
                type: 'string',
                description: 'Тип аккаунта',
              },
              role: {
                type: 'string',
                description: 'Роль',
              },
              credentials: {
                type: 'object',
                properties: {
                  email: {
                    type: 'string',
                    description: 'Email',
                  },
                  accessToken: {
                    type: 'string',
                    description: 'AccessToken',
                  },
                  refreshToken: {
                    type: 'string',
                    description: 'RefreshToken',
                  },
                },
              },
              profile: {
                type: 'string',
                description: 'Идентификатор профиля ',
              },
              _id: {
                type: 'string',
                description: 'Идентификатор аккаунта',
              },
            },
          },
          description: 'Список аккаунтов',
        },
        _id: {
          type: 'string',
          description: 'Идентификатор профиля',
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

  @UseGuards(YandexGuard)
  @Get('yandex')
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  yandexAuth() {}

  @UseGuards(YandexGuard)
  @Get('yandex/callback')
  async yandexCallback(@Req() req: IRequestYandexUser, @Res() res: Response) {
    const token = req.user['accessToken'];
    return res.redirect(
      `https://botkits.nomoreparties.co/api/yandex/success?token=${token}`,
    );
  }

  @Get('yandex/success')
  async yandexSuccess(@Query('token') token: string) {
    return this.httpService
      .get(`https://login.yandex.ru/info?format=json&oauth_token=${token}`)
      .pipe(
        mergeMap(({ data }) => {
          const newAccount: CombinedDto = {
            email: data.default_email,
            password: '',
            username: data.display_name,
            phone: data.default_phone.number,
            avatar: data.default_avatar_id,
          };
          const authDto = this.authDtoPipe.transform(newAccount, {
            type: 'body',
            data: 'combinedDto',
          });
          return this.authService.authSocial(authDto, TypeAccount.YANDEX);
        }),
      );
  }

  @UseGuards(GoogleGuard)
  @Get('google')
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  googleAuth() {}

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
        email: { type: 'string', description: 'Email пользователя' },
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
            'Ссылка на сброс пароля отправлена на ваш email: youremail@domain.ru',
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
