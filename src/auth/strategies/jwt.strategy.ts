import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ProfilesService } from 'src/profiles/profiles.service';
import { Profile } from 'src/profiles/schema/profile.schema';
import { BlacklistTokensService } from 'src/blacklistTokens/blacklistTokens.service';
import { jwtExtractorWS } from '../extractors/jwtExtractorFromWS';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private profilesService: ProfilesService,
    private blacklistTokensService: BlacklistTokensService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        jwtExtractorWS,
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      secretOrKey: configService.get('JWT_SECRET'),
      //сделать объект request доступным внутри validate
      passReqToCallback: true,
    });
  }

  async validate(request: any, jwtPayload: { sub: number }): Promise<Profile> {
    // Получаем токен из заголовка запроса
    //const token = ExtractJwt.fromAuthHeaderAsBearerToken()(request);
    const token = ExtractJwt.fromExtractors([
      jwtExtractorWS,
      ExtractJwt.fromAuthHeaderAsBearerToken(),
    ]);

    const user = await this.profilesService.findOne(jwtPayload.sub);
    console.log(token);
    // Проверяем токен на наличие в черном списке
    if (
      !token ||
      (await this.blacklistTokensService.isTokenBlacklisted(token)) ||
      !user
    ) {
      throw new UnauthorizedException('Пользователь не авторизован');
    } else {
      return user;
    }
  }
}
