import {
  ConflictException,
  Injectable,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { HashService } from '../hash/hash.service';
import { Profile, ProfileDocument } from 'src/profiles/schema/profile.schema';
import { ProfilesService } from 'src/profiles/profiles.service';
import { AccountService } from 'src/accounts/accounts.service';

export interface ITokens {
  accessToken: string;
  refreshToken: string;
}

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private profilesService: ProfilesService,
    private accountService: AccountService,
    private hashService: HashService,
  ) {}

  private async getTokens(profileId): Promise<ITokens> {
    const payload = { sub: profileId };
    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });
    return { accessToken, refreshToken };
  }

  async auth(profile: ProfileDocument): Promise<Profile> {
    const tokens = await this.getTokens(profile._id);
    const authProfile = await this.accountService.saveRefreshToken(
      profile._id,
      tokens,
    );
    const findProfile = await this.profilesService.findById(authProfile._id);
    return findProfile;
  }

  async validatePassword(
    accountEmail: string,
    password: string,
  ): Promise<Profile> {
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

  async refreshToken(oldRefreshToken: string): Promise<ITokens> {
    //--Проверяем, есть ли oldRefreshToken в базе данных и удаляем его--//
    const account = await this.accountService.findAndDeleteRefreshToken(
      oldRefreshToken,
    );

    if (!account) {
      throw new UnauthorizedException('Невалидный refreshToken');
    }

    //--Создаем новые accessToken и refreshToken--//
    const tokens = await this.getTokens(account.profile);

    //--Обновляем refreshToken в базе данных--//
    await this.accountService.saveRefreshToken(account.profile._id, tokens);

    return tokens;
  }

  async registration(authDto): Promise<Profile> {
    const { profileData, accountData } = authDto;

    //--Находим аккаунта по email--//
    const account = await this.accountService.findByEmail(
      accountData.credentials.email,
    );

    //--Если находим аккаунт, то не даем создавать второй аналогичный и не создаем профиль--//
    if (account) {
      throw new ConflictException('Аккаунт уже существует');
    }

    //--Создаем новый профиль--//
    const newProfile = await this.profilesService.create(profileData);

    //--Создаем новый аккаунт--//
    const newAccount = await this.accountService.create(
      accountData,
      newProfile._id,
    );

    //--Генерируем токены--//
    const tokens = await this.getTokens(newProfile._id);

    //--Добавляем accessToken и refreshToken к accountDto--//
    accountData.credentials.accessToken = tokens.accessToken;
    accountData.credentials.refreshToken = tokens.refreshToken;

    //--Обновляем аккаунт--//
    await this.accountService.update(newAccount._id, accountData);

    //-Добавляем к профилю в массив новый аккаунт--//
    newProfile.accounts.push(newAccount);
    await newProfile.save();
    delete newProfile.accounts[0].credentials.password;
    return newProfile;
  }

  async sendPasswordResetEmail(email) {
    const profile = await this.profilesService.findByEmail(email);
    if (!profile) {
      throw new NotFoundException('Пользователь с указанным Email не найден');
    }
    return {
      message: `Ссылка на сброс пароля отправлена на ваш email: ${email}`,
    };
  }
}
