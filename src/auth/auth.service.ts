import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { HashService } from '../hash/hash.service';
import { Profile, ProfileDocument } from 'src/profiles/schema/profile.schema';
import { ProfilesService } from 'src/profiles/profiles.service';
import { AccountService } from 'src/accounts/accounts.service';
import TypeAccount from 'src/accounts/types/type-account';
import { AuthDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private profilesService: ProfilesService,
    private accountService: AccountService,
    private hashService: HashService,
  ) {}

  private async getTokens(profileId) {
    const payload = { sub: profileId };
    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });
    return { accessToken, refreshToken };
  }

  async auth(profile: ProfileDocument) {
    const tokens = await this.getTokens(profile._id);
    const res = await this.accountService.saveRefreshToken(
      profile._id,
      tokens.refreshToken,
    );
    return res;
  }

  async validatePassword(
    accountEmail: string,
    password: string,
  ): Promise<Profile | null> {
    const account = await this.accountService.findByEmail(accountEmail);
    if (account.profile.accounts.length) {
      if (
        await this.hashService.isPasswordCorrect(
          password,
          account.credentials.password,
        )
      ) {
        return account.profile;
      } else
        throw new UnauthorizedException('Неверное имя пользователя или пароль');
    }
  }

  async refreshToken(oldRefreshToken: string) {
    //--Проверяем, есть ли oldRefreshToken в базе данных и удаляем его--//
    const account = await this.accountService.findAndDeleteRefreshToken(
      oldRefreshToken,
    );

    if (!account) {
      throw new UnauthorizedException('Невалидный refreshToken');
    }
    //--Создаем новые accessToken и refreshToken--//
    const payload = { sub: account.profile };
    const newAccessToken = this.jwtService.sign(payload);
    const newRefreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });
    //--Обновляем refreshToken в базе данных--//
    await this.accountService.saveRefreshToken(
      account.profile._id,
      newRefreshToken,
    );

    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
  }

  async registration(authDto) {
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
    const profileModel = await this.profilesService.create(profileDto);

    //--Создаем новый аккаунт--//
    const accountModel = await this.accountService.create(
      accountDto,
      profileModel._id,
    );

    //--Генерируем токены--//
    const tokens = await this.getTokens(profileModel._id);

    //--Добавляем accessToken и refreshToken к accountDto--//
    accountDto.credentials.accessToken = tokens.accessToken;
    accountDto.credentials.refreshToken = tokens.refreshToken;

    //--Обновляем аккаунт--//
    await this.accountService.update(accountModel._id, accountDto);

    //-Добавляем к профилю в массив новый аккаунт--//
    profileModel.accounts.push(accountModel);
    await profileModel.save();
    delete profileModel.accounts[0].credentials.password;
    return profileModel;
  }

  async authSocial(dataLogin: AuthDto) {
    const user = await this.accountService.findByEmailAndType(
      dataLogin.accountDto.credentials.email,
      dataLogin.accountDto.type,
    );

    if (user) {
      const tokens = await this.getTokens(user.profile._id);
      return tokens;
    }

    return await this.registration(dataLogin);
  }
}
