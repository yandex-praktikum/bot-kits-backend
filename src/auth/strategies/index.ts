import { GoogleStrategy } from './google.strategy';
import { JwtStrategy } from './jwt.strategy';
import { LocalStrategy } from './local.strategy';
import { YandexStrategy } from './yandex.strategy';

export const STRTAGIES = [
  LocalStrategy,
  JwtStrategy,
  YandexStrategy,
  GoogleStrategy,
];
