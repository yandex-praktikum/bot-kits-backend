//src/auth/auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { HashService } from '../hash/hash.service';
import { Profile, ProfileDocument } from 'src/profiles/schema/profile.schema';
import { ProfilesService } from 'src/profiles/profiles.service';
import { AccountService } from 'src/account/accounts.service';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private profilesService: ProfilesService,
    private accountService: AccountService,
    private hashService: HashService,
  ) {}

  async auth(profile: ProfileDocument) {
    const payload = { sub: profile._id };
    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });
    await this.accountService.saveRefreshToken(profile._id, refreshToken);
    return { accessToken, refreshToken };
  }
  //auth.service.ts
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
}
