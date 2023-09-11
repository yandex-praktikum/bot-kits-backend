import {
  Controller,
  Post,
  UseGuards,
  Req,
  Body,
  ConflictException,
} from '@nestjs/common';
import { LocalGuard } from './guards/localAuth.guard';
import { CreateProfileDto } from 'src/profiles/dto/create-profile.dto';
import { ApiTags, ApiOperation, ApiBody, ApiResponse } from '@nestjs/swagger';
import { AccountService } from 'src/account/accounts.service';
import { AuthDto } from './dto/auth.dto';
import { Profile, ProfileDocument } from 'src/profiles/schema/profile.schema';
import { ProfilesService } from 'src/profiles/profiles.service';
import { AuthService } from './auth.service';
import { AuthDtoPipe } from './pipe/auth-dto.pipe';

interface RequestProfile extends Request {
  user: ProfileDocument;
}

@ApiTags('auth')
@Controller()
export class AuthController {
  constructor(
    private accountService: AccountService,
    private profileService: ProfilesService,
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
  //auth.controller.ts
  @ApiOperation({
    summary: 'Регистрация',
  })
  @ApiBody({ type: CreateProfileDto })
  @Post('signup')
  async signup(@Body(new AuthDtoPipe()) authDto: AuthDto) {
    const { profileDto, accountDto } = authDto;

    //--Находим аккаунта по email--//
    const dublicateAccount = await this.accountService.findByEmail(
      accountDto.credentials.email,
    );

    //--Если находим аккаунт, то не даем создавать второй аналогичный и не создаем профиль--//
    if (dublicateAccount) {
      throw new ConflictException('Аккаунт уже существует');
    }

    //--Создаем новый профиль--//
    const profileModel = await this.profileService.create(profileDto);

    //--Создаем новый аккаунт--//
    const accountModel = await this.accountService.create(
      accountDto,
      profileModel._id,
    );

    //--Авторизуем пользователя--//
    const tokens = await this.authService.auth(profileModel);

    //--Добавляем accessToken и refreshToken к accountDto--//
    accountDto.credentials.accessToken = tokens.accessToken;
    accountDto.credentials.refreshToken = tokens.refreshToken;

    //--Обновляем аккаунт--//
    await this.accountService.update(
      accountModel._id.toHexString(),
      accountDto,
    );

    //-Добавляем к профилю в массив новый аккаунт--//
    profileModel.accounts.push(accountModel);
    await profileModel.save();
    delete profileModel.accounts[0].credentials.password;
    return profileModel;
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
