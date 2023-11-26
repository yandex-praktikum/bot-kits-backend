import { transports, format } from 'winston';
import {
  WinstonModule,
  utilities as nestWinstonModuleUtilities,
} from 'nest-winston';

export const LoggerFactory = (appName: string) => {
  const consoleFormat = format.combine(
    format.timestamp(),
    format.ms(),
    nestWinstonModuleUtilities.format.nestLike(appName, {
      colors: true,
      prettyPrint: true,
    }),
  );

  return WinstonModule.createLogger({
    transports: [
      new transports.Console({ format: consoleFormat }),
      new transports.File({
        filename: 'error.log',
        level: 'error',
        format: format.simple(),
      }),
    ],
  });
};
