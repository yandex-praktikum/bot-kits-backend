import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'email',
    });
  }

  async validate(accountEmail: string, password: string) {
    try {
      const profile = await this.authService.validatePassword(
        accountEmail,
        password,
      );
      return profile;
    } catch (err) {
      throw err;
    }
  }
}
