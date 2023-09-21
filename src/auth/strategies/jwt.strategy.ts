import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ProfilesService } from 'src/profiles/profiles.service';
import { Profile } from 'src/profiles/schema/profile.schema';
import { BlacklistTokensService } from 'src/blacklistTokens/blacklistTokens.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private profilesService: ProfilesService,
    private blacklistTokensService: BlacklistTokensService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get('JWT_SECRET'),
      //сделать объект request доступным внутри validate
      passReqToCallback: true,
    });
  }

  async validate(request: any, jwtPayload: { sub: number }): Promise<Profile> {
    // Получаем токен из заголовка запроса
    const token = ExtractJwt.fromAuthHeaderAsBearerToken()(request);
    const user = await this.profilesService.findOne(jwtPayload.sub);

    // Проверяем токен на наличие в черном списке
    if (
      (await this.blacklistTokensService.isTokenBlacklisted(token)) ||
      !user
    ) {
      throw new UnauthorizedException('Пользователь не авторизован');
    } else {
      return user;
    }
  }
}
