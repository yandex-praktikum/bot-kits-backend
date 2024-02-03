import { TButtonBlock } from 'src/bots/schema/types/botBuilderTypes';

export type TAttachment = {
  files?: [{ path: string; name: string; type: string }];
  buttons?: TButtonBlock[];
};

export type TMailingSchedule = {
  isNow: boolean;
  date?: Date;
  isRepeat: boolean;
  repeat?: string;
};
