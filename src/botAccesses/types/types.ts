type TAB_ACCESS = {
  voronki: string,
  newsletters?: string,
  lists?: string,
  statistic?: string,
  dialogs?: string,
  crm?: string,
  mini_landing?: string,
}

export enum LEVEL_ACCESS {
  EDITOR = 'editor',
  VIEWER = 'viewer',
}

export type TPermission = {
  [Property in keyof TAB_ACCESS]: LEVEL_ACCESS;
};

// По умолчанию предоставляется доступ только к вкладке Воронки на уровне просмотра
export const defaultPermission: TPermission = {
  'voronki': LEVEL_ACCESS.VIEWER,
}

export const fullPermission: TPermission = {
  'voronki': LEVEL_ACCESS.EDITOR,
  'newsletters': LEVEL_ACCESS.EDITOR,
  'lists': LEVEL_ACCESS.EDITOR,
  'statistic': LEVEL_ACCESS.EDITOR,
  'dialogs': LEVEL_ACCESS.EDITOR,
  'crm': LEVEL_ACCESS.EDITOR,
  'mini_landing': LEVEL_ACCESS.EDITOR,
}
