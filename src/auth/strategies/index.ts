import { GoogleStrategy } from './google.strategy';
import { JwtStrategy } from './jwt.strategy';
import { LocalStrategy } from './local.strategy';
import { TelegaStrategy } from './telegram.startegy';
import { VkontakteStrategy } from './vkontakte.strategy';

export const STRTAGIES = [
  LocalStrategy,
  JwtStrategy,
  GoogleStrategy,
  VkontakteStrategy,
  TelegaStrategy,
];
