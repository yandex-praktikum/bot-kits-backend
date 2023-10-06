import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { VerifyCallback } from 'jsonwebtoken';
import { Strategy, Profile as VkProfile } from 'passport-vkontakte';

@Injectable()
export class VkontakteStrategy extends PassportStrategy(Strategy, 'vkontakte') {
  constructor(private readonly configService: ConfigService) {
    super(
      {
        clientID: '51757364 ',
        clientSecret: '1rcjBbrkhDYp9uI9OMLV',
        callbackURL: 'http://localhost:3001/vkontakte/callback/',
        scope: ['profile', 'email'],
        profileFields: ['email'],
      },
      function (
        accessToken: string,
        refreshToken: string,
        profile: VkProfile,
        done: VerifyCallback,
      ) {
        const { displayName, photos, emails } = profile;
        return done(null, {
          profile: {
            username: displayName,
            avatar: photos[0].value,
            email: emails[0].value,
          },
          accessToken,
          refreshToken,
        });
      },
    );
  }
}
