export interface ISharedAccess {
  control: boolean;
  sharedAccess: boolean;
  mailing: boolean;
  manualControl: boolean;
  statistics: boolean;
}

export const sharedAccessDefault: ISharedAccess = {
  control: false,
  sharedAccess: true,
  mailing: false,
  manualControl: false,
  statistics: true,
};
