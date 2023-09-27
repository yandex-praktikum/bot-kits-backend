import { Controller, Post, UseGuards, Req, Body, Get } from '@nestjs/common';
import { Request } from 'express';
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
  @ApiResponse({
    status: 201,
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
    summary: 'Авторизация через Google',
  })
  @ApiResponse({
    status: 201,
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
  @ApiResponse({
    status: 201,
    type: ResetPasswordResponseBodyOK,
    description: 'Ссылка для сброса пароля отправлена на указанный Email',
  })
  @ApiResponse({
    status: 400,
    description: 'Некорректные данные',
  })
  @ApiResponse({
    status: 404,
    type: ResetPasswordResponseBodyNotFound,
    description: 'Пользователь с указанным Email не найден',
  })
  async resetPassword(@Body('email') email: string) {
    return await this.authService.sendPasswordResetEmail(email);
  }
}
