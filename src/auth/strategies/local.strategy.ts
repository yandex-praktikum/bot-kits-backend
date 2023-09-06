//src/auth/startegies/local.strategy.ts
import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super();
  }

  async validate(profilename: string, password: string) {
    const profile = await this.authService.validatePassword(
      profilename,
      password,
    );
    if (!profile) {
      throw new UnauthorizedException('Неверное имя пользователя или пароль');
    }
    return profile;
  }
}
