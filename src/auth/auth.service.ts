//src/auth/auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { HashService } from '../hash/hash.service';
import { Profile } from 'src/profiles/entities/profile.entity';
import { ProfilesService } from 'src/profiles/profiles.service';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private profilesService: ProfilesService,
    private hashService: HashService,
  ) {}

  async auth(profile: Profile) {
    const payload = { sub: profile.id };
    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });
    await this.profilesService.saveRefreshToken(profile._id, refreshToken);
    return { accessToken, refreshToken };
  }

  async validatePassword(profilename: string, password: string) {
    const profile = await this.profilesService.findByProfilename(profilename);
    if (profile) {
      if (
        await this.hashService.isPasswordCorrect(password, profile.password)
      ) {
        const profileObj = profile.toObject();
        delete profileObj.password;
        return profileObj;
      } else
        throw new UnauthorizedException('Неверное имя пользователя или пароль');
    }
    return null;
  }

  async refreshToken(oldRefreshToken: string) {
    //--Проверяем, есть ли oldRefreshToken в базе данных и удаляем его--//
    const profile = await this.profilesService.findAndDeleteRefreshToken(
      oldRefreshToken,
    );

    if (!profile) {
      throw new UnauthorizedException('Невалидный refreshToken');
    }
    //--Создаем новые accessToken и refreshToken--//
    const payload = { sub: profile.id };
    const newAccessToken = this.jwtService.sign(payload);
    const newRefreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });

    //--Обновляем refreshToken в базе данных--//
    await this.profilesService.saveRefreshToken(profile.id, newRefreshToken);

    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
  }
}
