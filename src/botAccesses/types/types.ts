//types.ts
type TAB_ACCESS = {
  dashboard?: string;
  voronki: string;
  mailing?: string;
  statistic?: string;
  // dialogs?: string;
  // crm?: string;
  // mini_landing?: string;
  // lists?: string;
};

export enum LEVEL_ACCESS {
  EDITOR = 'editor',
  VIEWER = 'viewer',
}

export type TPermission = {
  [Property in keyof TAB_ACCESS]: LEVEL_ACCESS;
};

// По умолчанию предоставляется доступ только к вкладке Воронки на уровне просмотра
export const defaultPermission: TPermission = {
  dashboard: LEVEL_ACCESS.VIEWER,
  voronki: LEVEL_ACCESS.EDITOR,
};

export const fullPermission: TPermission = {
  dashboard: LEVEL_ACCESS.EDITOR,
  voronki: LEVEL_ACCESS.EDITOR,
  mailing: LEVEL_ACCESS.EDITOR,
  statistic: LEVEL_ACCESS.EDITOR,
  // dialogs: LEVEL_ACCESS.EDITOR,
  // crm: LEVEL_ACCESS.EDITOR,
  // mini_landing: LEVEL_ACCESS.EDITOR,
  // lists: LEVEL_ACCESS.EDITOR,
};
