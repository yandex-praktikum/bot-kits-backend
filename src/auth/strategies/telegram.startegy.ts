import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import TelegramStrategy from 'passport-telegram-official';
import * as crypto from 'crypto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TelegaStrategy extends PassportStrategy(
  TelegramStrategy,
  'telegram',
) {
  constructor(private readonly configService: ConfigService) {
    super(
      {
        botToken: configService.get('TELEGRAM_BOT_TOKEN'),
        passReqToCallback: true,
      },
      (req, user, done) => {
        req.user = user;
        if (this.validate(user)) {
          return done(null, user);
        } else {
          throw new UnauthorizedException();
        }
      },
    );
  }

  async validate(query: any): Promise<any> {
    const { id, first_name, username, auth_date, hash } = query;
    const botToken = this.configService.get('TELEGRAM_BOT_TOKEN'); // замените на свой токен бота
    const dataCheckString = `auth_date=${auth_date}\nfirst_name=${first_name}\nid=${id}\nusername=${username}`;
    const secretKey = crypto.createHash('sha256').update(botToken).digest();
    const hashCheck = crypto
      .createHmac('sha256', secretKey)
      .update(dataCheckString)
      .digest('hex');

    return hash === hashCheck;
  }
}
