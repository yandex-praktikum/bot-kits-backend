import { TButtonBlock } from 'src/bots/schema/types/botBuilderTypes';

export type TAttachments = {
  photo?: { path: string; name: string };
  video?: { path: string; name: string };
  audio?: { path: string; name: string };
  buttons?: TButtonBlock[];
};

export type TMailingSchedule = {
  isNow: boolean;
  date?: Date;
  repeat: string;
};
