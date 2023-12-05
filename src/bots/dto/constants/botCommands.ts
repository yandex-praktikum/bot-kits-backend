export enum TypeCommands {
  COPY_BOT = '/copy',
  SHARE_BOT = '/share',
  RENAME_BOT = '/rename',
  GET_INFO = '/info',
  NOTIFY_SETTINGS = '/notify',
  DELETE_BOT = '/delete',
}

export const botCommands = [
  TypeCommands.COPY_BOT,
  TypeCommands.DELETE_BOT,
  TypeCommands.RENAME_BOT,
  TypeCommands.SHARE_BOT,
  TypeCommands.GET_INFO,
  TypeCommands.NOTIFY_SETTINGS,
];
