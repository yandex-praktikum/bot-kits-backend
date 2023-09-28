import { GoogleStrategy } from './google.strategy';
import { JwtStrategy } from './jwt.strategy';
import { LocalStrategy } from './local.strategy';
import { VkontakteStrategy } from './vkontakte.strategy';

export const STRTAGIES = [
  LocalStrategy,
  JwtStrategy,
  GoogleStrategy,
  VkontakteStrategy,
];
