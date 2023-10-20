import { ConfigService } from '@nestjs/config';
import { JwtModuleAsyncOptions, JwtModuleOptions } from '@nestjs/jwt';

const jwtModuleOptions = (configService: ConfigService): JwtModuleOptions => ({
  secret: configService.get('JWT_SECRET'),
  signOptions: {
    expiresIn: configService.get('JWT_EXPIRES', '1d'),
  },
});

export const jwtOptions = (): JwtModuleAsyncOptions => ({
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => jwtModuleOptions(configService),
});
