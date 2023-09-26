import { GoogleStrategy } from './google.strategy';
import { JwtStrategy } from './jwt.strategy';
import { LocalStrategy } from './local.strategy';

export const STRTAGIES = [LocalStrategy, JwtStrategy, GoogleStrategy];
